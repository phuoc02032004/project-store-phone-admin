import axiosClient from "./axiosClient";
import type { Coupon } from "@/types/Coupon";

const getCoupons = async () => {
    try {
        const response = await axiosClient.get<Coupon[]>("/coupons");
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getCoupon = async (id: string) => {
    try {
        const response = await axiosClient.get<Coupon>(`/coupon/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createCoupon = async (coupon: Coupon) => {
    try {
        const response = await axiosClient.post<Coupon>("/coupon", coupon);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

const updateCoupon = async (id: string, coupon: Partial<Coupon>) => {
    try {
        const response = await axiosClient.put<Coupon>(`/coupon/${id}`, coupon);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteCoupon = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/coupon/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
};
