import ls from "localstorage-slim";

ls.config.encrypt = true;

export const getUser = () => {
  return JSON.parse(ls.get("user"));
};

export const setUser = (user) => {
  ls.set("user", JSON.stringify(user));
};

export const removeUser = () => {
  ls.remove("user");
};
