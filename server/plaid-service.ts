import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import type { BankAccount, Transaction, BankSyncLog, InsertBankAccount, InsertTransaction, InsertBankSyncLog } from '@shared/schema';
import type { IStorage } from './storage';

export interface PlaidLinkResult {
  publicToken: string;
  metadata: {
    institution: {
      name: string;
      institution_id: string;
    };
    accounts: Array<{
      id: string;
      name: string;
      type: string;
      subtype: string;
      mask: string;
    }>;
  };
}

export interface PlaidTransactionSync {
  added: Array<{
    transaction_id: string;
    amount: number;
    description: string;
    merchant_name?: string;
    category: string[];
    subcategory?: string;
    date: string;
    pending: boolean;
    account_id: string;
    location?: {
      address?: string;
      city?: string;
      region?: string;
      postal_code?: string;
      country?: string;
      lat?: number;
      lon?: number;
    };
    payment_meta?: {
      reference_number?: string;
      ppd_id?: string;
      payee?: string;
    };
  }>;
  modified: Array<any>;
  removed: Array<{ transaction_id: string }>;
  nextCursor: string;
  hasMore: boolean;
}

export class PlaidService {
  private plaidClient: PlaidApi;
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
    
    // Initialize Plaid client
    const configuration = new Configuration({
      basePath: process.env.NODE_ENV === 'production' 
        ? PlaidEnvironments.production 
        : PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
          'PLAID-SECRET': process.env.PLAID_SECRET || '',
          'Plaid-Version': '2020-09-14',
        },
      },
    });

    this.plaidClient = new PlaidApi(configuration);
  }

  /**
   * Creates a link token for Plaid Link initialization
   */
  async createLinkToken(userId: string): Promise<string> {
    try {
      const request = {
        products: [Products.Transactions],
        client_name: "Foresee Financial Intelligence",
        country_codes: [CountryCode.Us],
        language: 'en',
        user: {
          client_user_id: userId
        },
        webhook: process.env.PLAID_WEBHOOK_URL || 'https://your-app.com/api/plaid/webhook'
      };

      const response = await this.plaidClient.linkTokenCreate(request);
      return response.data.link_token;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw new Error('Failed to create Plaid link token');
    }
  }

  /**
   * Exchanges public token for access token and stores bank accounts
   */
  async exchangePublicToken(userId: string, publicToken: string, metadata: PlaidLinkResult['metadata']): Promise<{ accounts: BankAccount[], accessToken: string }> {
    try {
      // Exchange public token for access token
      const exchangeResponse = await this.plaidClient.itemPublicTokenExchange({
        public_token: publicToken
      });

      const accessToken = exchangeResponse.data.access_token;

      // Get account details
      const accountsResponse = await this.plaidClient.accountsGet({
        access_token: accessToken
      });

      const bankAccounts: BankAccount[] = [];

      // Store each account in database
      for (const account of accountsResponse.data.accounts) {
        const bankAccount: InsertBankAccount = {
          userId,
          plaidAccountId: account.account_id,
          plaidAccessToken: accessToken,
          institutionName: metadata.institution.name,
          accountName: account.name,
          accountType: this.mapAccountType(account.type),
          accountSubtype: account.subtype || undefined,
          currentBalance: account.balances.current || 0,
          availableBalance: account.balances.available || undefined,
          isActive: 1,
          lastSyncedAt: new Date(),
          syncCursor: null // Will be set on first transaction sync
        };

        const savedAccount = await this.storage.addBankAccount(bankAccount);
        bankAccounts.push(savedAccount);
      }

      // Log successful connection
      await this.storage.addBankSyncLog({
        userId,
        bankAccountId: bankAccounts[0]?.id || null,
        eventType: 'sync',
        status: 'success',
        transactionsAdded: 0,
        transactionsModified: 0,
        transactionsRemoved: 0
      });

      return { accounts: bankAccounts, accessToken };
    } catch (error) {
      console.error('Error exchanging public token:', error);
      
      // Log error
      await this.storage.addBankSyncLog({
        userId,
        bankAccountId: null,
        eventType: 'error',
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new Error('Failed to connect bank account');
    }
  }

  /**
   * Syncs transactions for a specific bank account
   */
  async syncTransactions(bankAccount: BankAccount): Promise<{ added: number, modified: number, removed: number }> {
    try {
      const request = {
        access_token: bankAccount.plaidAccessToken,
        cursor: bankAccount.syncCursor || undefined
      };

      const response = await this.plaidClient.transactionsSync(request);
      
      let addedCount = 0;
      let modifiedCount = 0;
      let removedCount = 0;

      // Process added transactions
      if (response.data.added.length > 0) {
        const transactionsToAdd: InsertTransaction[] = response.data.added.map(txn => ({
          userId: bankAccount.userId,
          bankAccountId: bankAccount.id,
          plaidTransactionId: txn.transaction_id,
          amount: -txn.amount, // Plaid uses positive for expenses, we use negative
          description: txn.name,
          merchantName: txn.merchant_name || undefined,
          category: txn.category || [],
          subcategory: (txn.category && txn.category[1]) || undefined,
          date: new Date(txn.date),
          pending: txn.pending ? 1 : 0,
          accountName: txn.account_id,
          location: txn.location,
          paymentMeta: txn.payment_meta,
          isRecurring: 0, // TODO: Implement recurring detection
          budgetCategory: this.mapToUserBudgetCategory(txn.category || [])
        }));

        await this.storage.addTransactions(transactionsToAdd);
        addedCount = transactionsToAdd.length;
      }

      // Process modified transactions
      if (response.data.modified.length > 0) {
        for (const txn of response.data.modified) {
          const existingTransaction = await this.storage.getTransactionByPlaidId(txn.transaction_id);
          if (existingTransaction) {
            await this.storage.updateTransaction(existingTransaction.id, {
              amount: -txn.amount,
              description: txn.name,
              merchantName: txn.merchant_name || undefined,
              pending: txn.pending ? 1 : 0,
              updatedAt: new Date()
            });
            modifiedCount++;
          }
        }
      }

      // Process removed transactions
      if (response.data.removed.length > 0) {
        for (const removed of response.data.removed) {
          const existingTransaction = await this.storage.getTransactionByPlaidId(removed.transaction_id);
          if (existingTransaction) {
            await this.storage.deleteTransaction(existingTransaction.id);
            removedCount++;
          }
        }
      }

      // Update sync cursor and last synced time
      await this.storage.updateBankAccount(bankAccount.id, {
        syncCursor: response.data.next_cursor,
        lastSyncedAt: new Date()
      });

      // Log sync results
      await this.storage.addBankSyncLog({
        userId: bankAccount.userId,
        bankAccountId: bankAccount.id,
        eventType: 'sync',
        status: 'success',
        transactionsAdded: addedCount,
        transactionsModified: modifiedCount,
        transactionsRemoved: removedCount,
        syncCursor: response.data.next_cursor
      });

      return { added: addedCount, modified: modifiedCount, removed: removedCount };
    } catch (error) {
      console.error('Error syncing transactions:', error);
      
      // Log error
      await this.storage.addBankSyncLog({
        userId: bankAccount.userId,
        bankAccountId: bankAccount.id,
        eventType: 'sync',
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown sync error'
      });

      throw new Error('Failed to sync transactions');
    }
  }

  /**
   * Gets real-time account balances
   */
  async getAccountBalances(accessToken: string): Promise<Array<{ accountId: string, current: number, available?: number }>> {
    try {
      const response = await this.plaidClient.accountsBalanceGet({
        access_token: accessToken
      });

      return response.data.accounts.map(account => ({
        accountId: account.account_id,
        current: account.balances.current || 0,
        available: account.balances.available || undefined
      }));
    } catch (error) {
      console.error('Error getting account balances:', error);
      throw new Error('Failed to get account balances');
    }
  }

  /**
   * Handles webhook notifications from Plaid
   */
  async handleWebhook(webhookBody: any): Promise<void> {
    const { webhook_type, webhook_code, item_id } = webhookBody;

    if (webhook_type === 'TRANSACTIONS') {
      switch (webhook_code) {
        case 'SYNC_UPDATES_AVAILABLE':
          console.log('New transaction updates available for item:', item_id);
          // Find accounts with this access token and sync them
          // This would require storing item_id with accounts
          break;
        
        case 'INITIAL_UPDATE':
          console.log('Initial transaction sync complete for:', item_id);
          break;
        
        default:
          console.log('Unhandled transaction webhook:', webhook_code);
      }
    }
  }

  /**
   * Maps Plaid account types to our internal types
   */
  private mapAccountType(plaidType: string): "checking" | "savings" | "credit" | "investment" {
    switch (plaidType.toLowerCase()) {
      case 'depository':
        return 'checking'; // Default to checking for depository
      case 'credit':
        return 'credit';
      case 'investment':
        return 'investment';
      default:
        return 'checking';
    }
  }

  /**
   * Maps Plaid transaction categories to user budget categories
   */
  private mapToUserBudgetCategory(plaidCategories: string[]): string | undefined {
    if (!plaidCategories || plaidCategories.length === 0) return undefined;

    const categoryMap: { [key: string]: string } = {
      'Food and Drink': 'Food & Dining',
      'Shops': 'Shopping',
      'Transportation': 'Transportation',
      'Healthcare': 'Healthcare',
      'Entertainment': 'Entertainment',
      'Travel': 'Travel',
      'Bills': 'Bills & Utilities',
      'Gas Stations': 'Transportation',
      'Groceries': 'Food & Dining',
      'Restaurants': 'Food & Dining'
    };

    // Check primary category first
    const primaryCategory = plaidCategories[0];
    if (categoryMap[primaryCategory]) {
      return categoryMap[primaryCategory];
    }

    // Check subcategories
    for (const category of plaidCategories) {
      if (categoryMap[category]) {
        return categoryMap[category];
      }
    }

    return 'Other';
  }
}