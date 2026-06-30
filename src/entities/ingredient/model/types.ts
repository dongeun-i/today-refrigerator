export interface Ingredient {
  id: string;
  name: string;
  category: string;
  storage: string; // 냉장, 냉동, 실온
  imageUrl?: string;
  expiryDate: string;
  daysLeft: number;
  remainingAmount: string;
  remainingPercent: number;
}
