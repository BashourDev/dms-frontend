import ls from "localstorage-slim";

ls.config.encrypt = true;

export const getToken = () => {
  return ls.get("token");
};

export const setToken = (token) => {
  ls.set("token", token);
};

export const removeToken = () => {
  ls.remove("token");
};
