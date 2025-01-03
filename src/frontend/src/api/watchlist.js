import { getAuthHeader, getAxiosConfig, getErrorMessages } from "./config";

const axios = getAxiosConfig();

export const fetchWatchlistAPI = async (authToken, page, isComplete) => {
  try {
    const response = await axios.get("watchlist/", {
      headers: getAuthHeader(authToken),
      params: {
        page,
        is_complete: isComplete,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};

export const addItemAPI = async (authToken, movieID) => {
  try {
    const response = await axios.post(
      "watchlist/add-item/",
      { movie_id: movieID },
      {
        headers: getAuthHeader(authToken),
      }
    );
    return response.data;
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};

export const updateItemAPI = async (authToken, itemID, isComplete) => {
  try {
    const response = await axios.put(
      `watchlist/update-item/${itemID}/`,
      { is_complete: isComplete },
      {
        headers: getAuthHeader(authToken),
      }
    );
    return response.data;
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};

export const removeItemAPI = async (authToken, itemID) => {
  try {
    const response = await axios.delete(`watchlist/remove-item/${itemID}/`, {
      headers: getAuthHeader(authToken),
    });
    return response.data;
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};
