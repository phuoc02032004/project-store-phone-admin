export interface Category{
    _id: string;
    name: string;
    slug: string;
    description: string;
    parent: Category[] | null;
    level: number;
    ancestors: Ancestors[] | null;
    image: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Ancestors {
    _id: string;
    name: string;
    slug: string;
}