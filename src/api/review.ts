import axiosClient from "./axiosClient";
import type { Review } from "@/types/Review";

const getReviews = async (productId?: string) => {
    try {
        const url = productId ? `/reviews/${productId}` : "/reviews";
        const response = await axiosClient.get<Review[]>(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getReview = async (id: string) => {
    try {
        const response = await axiosClient.get<Review>(`/review/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createReview = async (review: Review) => {
    try {
        const response = await axiosClient.post<Review>("/review", review);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const updateReview = async (id: string, review: Review) => {
    try {
        const response = await axiosClient.put<Review>(`/review/${id}`, review);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

const deleteReview = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/review/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
};