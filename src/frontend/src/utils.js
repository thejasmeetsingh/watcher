export const getImageURL = (key) => {
  if (key) {
    return `https://image.tmdb.org/t/p/original${key}`;
  }

  // Find viewPort dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Send a default placeholder image based on the viewPort dimensions
  return `https://placehold.co/${viewportWidth}x${viewportHeight}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
