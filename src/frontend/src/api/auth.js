import { getAxiosConfig, getErrorMessages } from "./config";

const axios = getAxiosConfig();

export const signInAPI = async ({ email, password }) => {
  try {
    const response = await axios.post("login/", { email, password });
    return response.data;
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};

export const singUpAPI = async ({ email, password, name, age }) => {
  try {
    const response = await axios.post("register/", {
      email,
      password,
      name,
      age,
    });
    return response.data;
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};

export const logoutAPI = async (token) => {
  try {
    const response = await axios.post("logout/");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const profileUpdateAPI = async ({ email, name, age, genres }) => {
  try {
    const response = await axios.patch("update/");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const passwordUpdateAPI = async ({ oldPassword, newPassword }) => {
  try {
    const response = await axios.put("password/");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
