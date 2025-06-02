export interface Notify {
    _id?: string;
    title: string;
    body: string;
    imageUrl?: string;
    data?: Record<string, any>;
    recipient?: string;
    fcmToken?: string;
    read: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
 }