export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;

    // Check if token is expired (compared to current time in seconds)
    return Date.now() >= exp * 1000;
  } catch (err) {
    return true; // if any error, consider it expired
  }
};
