# Plaid API Setup Guide

## Step 1: Create a Plaid Account
1. Go to https://plaid.com/
2. Click "Get API Keys" or "Sign Up" in the top right
3. Choose "Get started for free"
4. Fill out the form with your information:
   - Company name: "Foresee Financial Intelligence" (or your company name)
   - Use case: "Personal Finance Management"
   - Expected volume: "Less than 1,000 users"

## Step 2: Complete Account Verification
1. Verify your email address when you receive the confirmation email
2. Complete any additional verification steps Plaid requires

## Step 3: Access Your Dashboard
1. Log into your Plaid dashboard at https://dashboard.plaid.com/
2. You'll see your development environment by default

## Step 4: Get Your API Keys
1. In the dashboard, look for "Keys" or "API Keys" in the left sidebar
2. You'll see two important values:
   - **Client ID**: This will look like: `507f1f77bcf86cd799439011`
   - **Secret Key (Sandbox)**: This will look like: `development_secret_12345678-1234-1234-1234-123456789012`

## Step 5: Add Keys to Replit
1. In your Replit project, click on "Tools" in the bottom left
2. Click on "Secrets" (the key icon)
3. Add two new secrets:
   - Name: `PLAID_CLIENT_ID`, Value: [your client ID from step 4]
   - Name: `PLAID_SECRET`, Value: [your sandbox secret from step 4]

## Step 6: Test the Integration
Once you've added the secrets, the bank integration will be ready to test with:
- Sandbox bank accounts (fake data for testing)
- Real bank connections (when you're ready for production)

## Important Notes:
- Start with sandbox/development mode (free)
- Sandbox lets you test with fake bank accounts
- Production mode requires additional verification and has usage fees
- Your secret keys are encrypted and secure in Replit

## Sandbox Test Credentials:
When testing, you can use these fake credentials:
- Username: `user_good`
- Password: `pass_good`
- PIN: `1234` (if prompted)

## Need Help?
If you encounter any issues:
1. Check Plaid's documentation: https://plaid.com/docs/
2. Make sure you're using the sandbox/development keys
3. Verify the secrets are properly added to Replit