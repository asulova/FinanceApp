export interface Budget {
    id: number;
    userId: string;
    amount: number;
    periodStart: string; // formatted as "yyyy-MM-dd"
    periodEnd: string;   // formatted as "yyyy-MM-dd"
}