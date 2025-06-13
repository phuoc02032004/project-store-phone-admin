import axios from "axios";
import type { Product } from "@/types/Products";

const productApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
    },
});

productApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("tokenAdmin");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const getProducts = async (params?: { isNewArrival?: boolean; isBestSeller?: boolean }): Promise<Product[]> => {
    try {
        const response = await productApi.get('/products', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

const getProduct = async (id: string) => {
    try {
        const response = await productApi.get<Product>(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const addProduct = async (product: FormData) => {
    try {
        const response = await productApi.post<Product>("/products", product);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateProduct = async (id: string, product: FormData) => {
    try {
        const response = await productApi.put<Product>(`/products/${id}`, product, {
            headers: {
                'Content-Type': undefined,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteProduct = async (id: string) => {
    try {
        const response = await productApi.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };