import { toast } from "react-toastify";
import api from "./api";

const SetupInterceptors = (navigate, location) => {
  api.interceptors.response.use(null, (error) => {
    if (error?.response?.status === 401 && location.pathname !== "/login") {
      console.log("err", error);
      // toast.error("wrong email or password");
      navigate("/login");
    }
    // else if (error?.response?.status === 403) {
    //   toast.error("unauthorized");
    // } else if (error?.response?.status === 404) {
    //   navigate("/404");
    // } else {
    //   toast.error("error 500");
    // }

    return Promise.reject(error);
  });
};

export default SetupInterceptors;
