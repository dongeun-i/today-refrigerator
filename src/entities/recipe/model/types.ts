export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  matchingIngredients: number;
  cookTime?: string;
  difficulty?: string;
}
