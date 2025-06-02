import type { User } from '@/types/User'
import axiosClient from './axiosClient'

const getUser = async (id: string) => {
    try {
        const response = await axiosClient.get<User>(`/user/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

const getUsers = async () => {
    try {
        const response = await axiosClient.get<User[]>('/users')
        return response.data
    } catch (error) {
        throw error
    }
}

const updateUser = async (id: string, userData: Partial<User>) => {
    try {
        const response = await axiosClient.put<User>(`/user/${id}`, userData)
        return response.data
    } catch (error) {
        throw error
    }
}

const deleteUser = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/user/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export { getUser, getUsers, updateUser, deleteUser }