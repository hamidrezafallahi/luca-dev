import { IUser } from '@models/user';

export interface IDetailedProductCardProps {
  product: {
    id: number;
    slug?: string | null;
    name: string;
    description: string;
    price: number;
    finalPrice: number;
    inventory: number;
    mainImage: string | null;
    imageUrl?: string;
    categoryName?: string;
    brandName?: string;
    discount?: number;
    rating?: number;
    isAvailable?: boolean;
  };
  locale: string;
}
/**
 * What the listing card reads. The listing endpoints differ: /Products sends
 * categoryName and brandName, the category listing sends Persian/English
 * category names and prices. Every field beyond the basics is optional.
 */
export interface ISimpleProduct {
    id: number;
    slug?: string | null;
    name: string;
    description: string;
    mainImage: string | null;
    imageUrls?: string[] | null;
    suppliers?:IUser[]
    categoryName?: string | null;
    persianCategoryName?: string | null;
    englishCategoryName?: string | null;
    brandName?: string | null;
    price?: number | null;
    finalPrice?: number | null;
}
