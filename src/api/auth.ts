import axiosClient from "./axiosClient";

const login = async (email: string, password: string) => {
  try {
    const response = await axiosClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { login };