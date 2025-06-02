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
        const response = await axiosClient.get<Category>(`/category/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const addCategory = async (category: Category) => {
    try {
        const response = await axiosClient.post<Category>("/category", category);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
        const response = await axiosClient.put<Category>(`/category/${id}`, category);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const deleteCategory = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/category/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getCategories, getCategory, addCategory, updateCategory, deleteCategory };