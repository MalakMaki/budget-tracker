export type Transaction = {
    date: string;          // ISO format, e.g. "2026-10-03"
    description: string;   // raw text from the bank
    amount: number;        // negative = money out, positive = money in
};