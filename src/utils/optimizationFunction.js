export const baseUrl = "http://10.10.20.52:6002";
export const imageBaseUrl = "http://10.10.20.52:6002";

export const imageUrl = (image) => {
  return image
    ? image?.startsWith("http")
      ? image
      : image?.startsWith("/")
      ? `${imageBaseUrl}${image}`
      : `${imageBaseUrl}/${image}`
    : "https://placehold.co/178x200";
};

export const convertDate = (date) => {
  const createdAt = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - createdAt);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) {
    return `${diffDays} days ago`;
  } else {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours} hours ago`;
    } else {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes > 0) {
        return `${diffMinutes} minutes ago`;
      } else {
        return "Just now";
      }
    }
  }
};

export const dateFormate = (date) => {
  const createdAt = new Date(date);
  return createdAt.toLocaleDateString();
};

export const perfectImageReturn = (image, fallback = "https://placehold.co/400") => {
  if (!image) return fallback;

  if (image instanceof File) {
    return URL.createObjectURL(image);
  }

  if (typeof image === "string") {
    if (image.startsWith("data:")) return image;
    if (/^https?:\/\//.test(image)) return image;
    return image;
  }
  return fallback;
};
