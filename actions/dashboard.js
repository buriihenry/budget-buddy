"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
    const serialized = { ...obj };
    
    if (obj.balance){
        serialized.balance = obj.balance.toNumber();
    }
    
    if (obj.amount){
        serialized.amount = obj.amount.toNumber();
    }

    return serialized;
};

export async function createAccount(data) {

    try {
        const {userId} = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        });

        if (!user) {
            throw new Error("User not found");
        }
        // convert balance to float before saving

        const balanceFloat = parseFloat(data.balance);
        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance");
        }

        // Check if this is the user's first account
        const existingAccounts = await db.account.findMany({
            where: {userId: user.id},
        });

        const shouldBeDefault = existingAccounts.length === 0?true: data.default;

        // If this account should be the default, update all other accounts to not be the default

        if (shouldBeDefault) {
            await db.account.updateMany({
                where: {userId: user.id, isDefault: true},
                data: {isDefault: false},
            });
        }
        
        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,
            },
        });

        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard")
        return {success: true, data: serializedAccount };

    } catch (error) {

        throw new Error(error.message);
        
    }
}

export async function getUserAccounts() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    try {
      const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              transactions: true,
            },
          },
        },
      });
      // Serialize accounts before sending to client
    const serializedAccounts = accounts.map(serializeTransaction);

    return serializedAccounts;
  } catch (error) {
    console.error(error.message);
  }
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}

export async function getUserTransactions(limit = 10) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: limit,
  });

  return transactions.map(serializeTransaction);
}