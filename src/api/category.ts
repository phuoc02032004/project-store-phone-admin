import axiosClient from "./axiosClient";
import type { Category } from "@/types/Category";

const getCategories = async () => {
    try {
        const response = await axiosClient.get<Category[]>("/categories");
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getCategory = async (id: string) => {
    try {
        const response = await axiosClient.get<Category>(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const addCategory = async (category: Category) => {
    try {
        const response = await axiosClient.post<Category>("/categories", category,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
        const response = await axiosClient.put<Category>(`/categories/${id}`, category);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const deleteCategory = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getCategories, getCategory, addCategory, updateCategory, deleteCategory };