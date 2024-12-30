import { getAxiosConfig, getErrorMessages } from "./config";

const axios = getAxiosConfig();

export const fetchGenresAPI = async () => {
  try {
    const response = await axios.get("content/genres/");
    return response.data;
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};

export const fetchFeaturedMoviesAPI = async () => {
  try {
    const response = await axios.get("content/featured-movies/");
    return {
      nowPlaying: response.data.now_playing,
      popular: response.data.popular,
      topRated: response.data.top_rated,
      upcoming: response.data.upcoming,
    };
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};

export const getMovieDetailAPI = async (movieID) => {
  try {
    const response = await axios.get(`content/detail/${movieID}/`);
    return response.data;
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};

export const getMoviesByGenreAPI = async (genreID, page) => {
  try {
    const response = await axios.get(`content/genre/${genreID}/`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};

export const searchMovieAPI = async (query, page) => {
  try {
    const response = await axios.get(`content/search/`, {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.log("error:", error);
    return getErrorMessages(error.response);
  }
};
