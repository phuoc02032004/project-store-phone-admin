export interface User {
    _id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    fcmToken?: string;
}