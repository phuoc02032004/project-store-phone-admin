import axiosClient from "./axiosClient";
import type { Order } from "@/types/Order";

const getOrders = async () => {
    try {
        const response = await axiosClient.get<Order[]>("/orders");
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getOrder = async (id: string) => {
    try {
        const response = await axiosClient.get<Order>(`/order/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const addOrder = async (order: Order) => {
    try {
        const response = await axiosClient.post<Order>("/order", order);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateOrder = async (id: string, order: Partial<Order>) => {
    try {
        const response = await axiosClient.put<Order>(`/order/${id}`, order);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteOrder = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/order/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateOrderStatus = async (id: string, orderStatus: string, paymentMethod: string) => {
    try {
        const response = await axiosClient.patch<Order>(`/orders/${id}`, { orderStatus, paymentMethod });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getOrderById = async (id: string) => {
    try {
        const response = await axiosClient.get<Order>(`/orders/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getOrders, getOrder, addOrder, updateOrder, deleteOrder, updateOrderStatus, getOrderById };