import axiosClient from "./axiosClient";
import type { Notify } from "@/types/Notify";

const getNotifications = async (recipient?: string) => {
    try {
        const response = await axiosClient.get<Notify[]>("/notifications", {
            params: { recipient },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getNotification = async (id: string) => {
    try {
        const response = await axiosClient.get<Notify>(`/notification/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const addNotification = async (notification: Notify) => {
    try {
        const response = await axiosClient.post<Notify>("/notification", notification);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateNotification = async (id: string, notification: Partial<Notify>) => {
    try {
        const response = await axiosClient.put<Notify>(`/notification/${id}`, notification);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteNotification = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/notification/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getNotifications,
    getNotification,
    addNotification,
    updateNotification,
    deleteNotification,
};