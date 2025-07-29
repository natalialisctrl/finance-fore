import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Building2, 
  CreditCard, 
  Banknote, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BankAccount {
  id: number;
  institutionName: string;
  accountName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment';
  currentBalance: number;
  availableBalance?: number;
  isActive: boolean;
  lastSyncedAt: string;
}

interface Transaction {
  id: number;
  amount: number;
  description: string;
  merchantName?: string;
  category: string[];
  date: string;
  pending: boolean;
  budgetCategory?: string;
}

interface SyncResult {
  added: number;
  modified: number;
  removed: number;
}

export function BankConnection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch connected bank accounts
  const { data: bankAccounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['/api/bank-accounts'],
    enabled: true
  });

  // Fetch recent transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions'],
    enabled: true
  });

  // Sync transactions mutation
  const syncMutation = useMutation({
    mutationFn: async (accountId: number) => {
      const response = await fetch(`/api/bank-accounts/${accountId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Sync failed');
      return response.json();
    },
    onSuccess: (data: SyncResult) => {
      toast({
        title: "Sync Complete",
        description: `Added ${data.added} new transactions, updated ${data.modified}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bank-accounts'] });
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Could not sync transactions. Please try again.",
        variant: "destructive"
      });
    }
  });

  const connectBank = async () => {
    setIsConnecting(true);
    try {
      // Step 1: Get link token
      const linkResponse = await fetch('/api/plaid/link-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!linkResponse.ok) {
        throw new Error('Failed to get link token');
      }

      const { link_token } = await linkResponse.json();

      // Step 2: Initialize Plaid Link (this would typically use Plaid Link SDK)
      // For now, show instructions to user
      toast({
        title: "Bank Connection Ready",
        description: "Plaid Link token created. In production, this would open the bank selection interface.",
      });

    } catch (error) {
      console.error('Bank connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to bank. Please ensure Plaid credentials are configured.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return <Wallet className="h-4 w-4" />;
      case 'savings': return <Banknote className="h-4 w-4" />;
      case 'credit': return <CreditCard className="h-4 w-4" />;
      case 'investment': return <TrendingUp className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getTransactionIcon = (amount: number) => {
    return amount > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  if (accountsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Connections
          </CardTitle>
          <CardDescription>
            Connect your bank accounts for real-time transaction insights and automated budget tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bankAccounts.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Banks Connected</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Connect your bank account to get real transaction data instead of using mock data
              </p>
              <Button 
                onClick={connectBank} 
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isConnecting ? "Connecting..." : "Connect Bank Account"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bankAccounts.map((account: BankAccount) => (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getAccountIcon(account.accountType)}
                    <div>
                      <h4 className="font-semibold">{account.accountName}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {account.institutionName} • {account.accountType}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(account.currentBalance)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={account.isActive ? "default" : "secondary"}>
                        {account.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncMutation.mutate(account.id)}
                        disabled={syncMutation.isPending}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Sync
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                onClick={connectBank}
                variant="outline"
                disabled={isConnecting}
                className="w-full"
              >
                Connect Another Bank
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Real-time transaction data from your connected bank accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction: Transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.amount)}
                    <div>
                      <h4 className="font-medium">{transaction.description}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        {transaction.merchantName && (
                          <>
                            <span>{transaction.merchantName}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{formatDate(transaction.date)}</span>
                        {transaction.pending && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">Pending</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    {transaction.budgetCategory && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {transaction.budgetCategory}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {transactions.length > 10 && (
              <div className="text-center mt-4">
                <Button variant="outline" size="sm">
                  View All Transactions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Setup Instructions */}
      {bankAccounts.length === 0 && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <AlertCircle className="h-5 w-5" />
              Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-blue-700 dark:text-blue-300">
              <p>To connect real bank accounts, you need Plaid API credentials:</p>
              <div className="space-y-1 text-sm">
                <p>1. Sign up for free at plaid.com</p>
                <p>2. Get your Client ID and Secret Key</p>
                <p>3. Add them as PLAID_CLIENT_ID and PLAID_SECRET in Replit secrets</p>
              </div>
              <p className="text-sm">
                See PLAID_SETUP_GUIDE.md in your project for detailed instructions.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}