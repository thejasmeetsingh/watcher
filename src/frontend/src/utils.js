export const getImageURL = (key) => {
  return `https://image.tmdb.org/t/p/original${key}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
