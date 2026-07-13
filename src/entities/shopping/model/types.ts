export type TripStatus = 'planned' | 'in_progress' | 'completed';

export interface ShoppingTrip {
  id: string;
  title: string;
  status: TripStatus;
  budget: number | null;
  total_spent: number | null;
  created_at: string;
  completed_at: string | null;
}

export interface ShoppingItem {
  id: string;
  trip_id: string;
  category_id: string | null;
  name: string;
  quantity: number;
  unit: string;
  note: string | null;
  checked: number;
  price: number | null;
  created_at: string;
}
