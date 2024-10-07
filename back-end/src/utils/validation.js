const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const isValidURL = url => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export { emailRegex, phoneRegex, isValidURL };