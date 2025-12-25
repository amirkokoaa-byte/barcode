
export interface ProductInfo {
  name: string;
  brand: string;
  description: string;
  origin: 'مصر' | 'مستورد' | 'غير معروف';
  isLocal: boolean;
  category: string;
  images: string[];
  nutrition?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    sugar: number;
    fiber: number;
    sodium: number;
    servingSize: string;
  };
  ingredients: string[];
  allergens: string[];
  healthAnalysis: {
    score: number; // 1-100
    summary: string;
    pros: string[];
    cons: string[];
  };
  pricing: {
    averagePrice: string;
    comparison: Array<{
      store: string;
      price: string;
      url: string;
    }>;
  };
  alternatives: Array<{
    name: string;
    reason: string;
  }>;
}

export interface ShoppingListItem {
  id: string;
  product: ProductInfo;
  addedAt: number;
}
