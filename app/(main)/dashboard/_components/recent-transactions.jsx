"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";

export function RecentTransactions({ transactions }) {
  // Get only the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-normal">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    "px-2 py-1 text-xs",
                    categoryColors[transaction.category] || "bg-gray-100"
                  )}
                >
                  {transaction.category}
                </Badge>
                <div>
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <p
                className={cn(
                  "text-sm font-medium",
                  transaction.type === "INCOME"
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {transaction.type === "INCOME" ? "+" : "-"}$
                {Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 