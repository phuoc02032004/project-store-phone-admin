import axiosClient from "./axiosClient";

const login = async (email: string, password: string) => {
  try {
    const response = await axiosClient.post("/auth/login", {
      email,
      password,
    });
    if (response.data.data.role !== "admin") {
      throw new Error("You do not have admin privileges.");
    }
    localStorage.setItem("token", response.data.data.token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { login };