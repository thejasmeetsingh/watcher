import axios from "axios";

export const getAxiosConfig = () => {
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

  const instance = axios.create({
    baseURL: apiBaseURL,
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
  });

  return instance;
};

export const getErrorMessages = (response) => {
  const detail = response.data.detail;
  const errorMessages = {};

  if (Array.isArray(detail)) {
    detail.forEach((err, _) => {
      const field = err.loc[1];
      errorMessages[field] = err.msg;
    });
  } else {
    errorMessages.default = detail;
  }

  return { errors: errorMessages };
};

export const getAuthHeader = (authToken) => {
  const header = authToken
    ? {
        Authorization: `Bearer ${authToken}`,
      }
    : undefined;

  return header;
};
