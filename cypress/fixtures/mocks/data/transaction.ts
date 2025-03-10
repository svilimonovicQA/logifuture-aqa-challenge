import { faker } from "@faker-js/faker";

/**
 * Represents a financial transaction
 * @interface Transaction
 * @property {string} transactionId - Unique identifier for the transaction
 * @property {string} currency - The currency code of the transaction
 * @property {number} amount - The transaction amount
 * @property {'credit' | 'debit'} type - The type of transaction
 * @property {'pending' | 'finished'} status - Current status of the transaction
 * @property {string} createdAt - Timestamp when transaction was created
 * @property {'approved' | 'denied'} outcome - The outcome of the transaction
 * @property {string} updatedAt - Timestamp when transaction was last updated
 */
interface Transaction {
  transactionId?: string;
  currency: string;
  amount: number;
  type: "credit" | "debit";
  status?: "pending" | "finished";
  createdAt?: string;
  outcome?: "approved" | "denied";
  updatedAt?: string;
}

/**
 * Mock transaction data
 * Used for testing wallet operations
 */
export const transaction: Transaction = {
  currency: "EUR",
  amount: 500,
  type: "credit",
};
