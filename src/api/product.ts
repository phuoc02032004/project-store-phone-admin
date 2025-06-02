import axiosClient from "./axiosClient";
import type { Product } from "@/types/Products";

const getProducts = async () => {
    try {
        const response = await axiosClient.get<Product[]>("/products");
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getProduct = async (id: string) => {
    try {
        const response = await axiosClient.get<Product>(`/product/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const addProduct = async (product: Product) => {
    try {
        const response = await axiosClient.post<Product>("/product", product);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
        const response = await axiosClient.put<Product>(`/product/${id}`, product);
        return response.data;
    } catch (error) {
        throw error;
    }
};  

const deleteProduct = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/product/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };