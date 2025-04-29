import React from 'react';
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from "lucide-react";
import { getUserAccounts, getUserTransactions } from '@/actions/dashboard';
import { AccountCard } from './_components/account-card';
import { TransactionTable } from '../account/_components/transaction-table';


async function DashboardPage () {
  const accounts = await getUserAccounts();
  const transactions = await getUserTransactions(); // Fetch all transactions

  const safeAccounts = Array.isArray(accounts) ? accounts.filter(account => account?.id) : [];

  return (<div className='px-5'>
    {/* Budget Progress */}

    {/* Overview */}

    {/* Accounts Grid */}

    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <CreateAccountDrawer>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
                <CardContent className="flex flex-col items-center justify-center
                text-muted-foreground h-full pt-5">
                    <Plus className='w-10 h-10 mb-2' />
                    <p className="text-sm font-medium">Add new Account</p>
                </CardContent>
            </Card>
        </CreateAccountDrawer>

        {safeAccounts.length > 0 &&
          safeAccounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}

    </div>

    {/* Recent Transactions Table */}
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
      <TransactionTable transactions={transactions} />
    </div>

  </div>
  )
};

export default DashboardPage;

