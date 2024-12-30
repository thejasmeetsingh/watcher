import { getAxiosConfig, getErrorMessages } from "./config";

const axios = getAxiosConfig();

export const signInAPI = async ({ email, password }) => {
  try {
    const response = await axios.post("auth/login/", { email, password });
    return response.data;
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};

export const singUpAPI = async ({ email, password, name, age }) => {
  try {
    const response = await axios.post("auth/register/", {
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
