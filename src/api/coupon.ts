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
        const response = await axiosClient.get<Coupon>(`/coupons/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createCoupon = async (coupon: Coupon) => {
    try {
        const response = await axiosClient.post<Coupon>("/coupons", coupon);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

const updateCoupon = async (id: string, coupon: Partial<Coupon>) => {
    try {
        const response = await axiosClient.put<Coupon>(`/coupons/${id}`, coupon);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteCoupon = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/coupons/${id}`);
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
