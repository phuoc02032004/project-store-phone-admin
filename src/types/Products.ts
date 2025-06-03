import type { Category } from './Category';
import type { Review } from './Review';

export interface Product {
    _id: string;
    name: string;
    description: string;
    category: Category;
    image: string;
    isNewArrival: boolean;
    isBestSeller: boolean;
    reviews: Review[];
    rating: number;
    numReviews: number;
    variants: Variant[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Variant {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    sku: string;
    stock: number;
    capacity: string;
    color: string;
    size: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}   