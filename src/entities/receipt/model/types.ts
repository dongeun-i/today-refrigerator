export interface Receipt {
  id: string;
  trip_id: string;
  image_uri: string | null;
  store_name: string | null;
  total_amount: number | null;
  purchased_at: string | null;
  created_at: string;
}
