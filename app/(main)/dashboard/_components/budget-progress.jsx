"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, AlertCircle } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";
import { cn } from "@/lib/utils";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const remainingAmount = initialBudget
    ? initialBudget.amount - currentExpenses
    : 0;

  const getProgressColor = (percent) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusMessage = (percent) => {
    if (percent >= 90) return "Budget almost exceeded!";
    if (percent >= 75) return "Budget getting tight";
    return "Budget in good shape";
  };

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-base font-medium">
            Monthly Budget
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {initialBudget
                    ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Budget Utilization</span>
                <span className={cn(
                  "text-sm font-medium",
                  percentUsed >= 90 ? "text-red-500" : 
                  percentUsed >= 75 ? "text-yellow-500" : 
                  "text-green-500"
                )}>
                  {percentUsed.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={percentUsed}
                className={getProgressColor(percentUsed)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-lg font-bold text-green-500">
                  ${remainingAmount.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  <AlertCircle className={cn(
                    "h-4 w-4",
                    percentUsed >= 90 ? "text-red-500" : 
                    percentUsed >= 75 ? "text-yellow-500" : 
                    "text-green-500"
                  )} />
                  <p className={cn(
                    "text-sm font-medium",
                    percentUsed >= 90 ? "text-red-500" : 
                    percentUsed >= 75 ? "text-yellow-500" : 
                    "text-green-500"
                  )}>
                    {getStatusMessage(percentUsed)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Set a budget to track your spending
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}