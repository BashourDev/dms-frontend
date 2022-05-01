import React, { useContext, useState } from "react";
import * as Yup from "yup";
import AppSubmitButton from "../components/forms/components/AppSubmitButton";
import AppForm from "../components/forms/components/AppForm";
import AppInput from "../components/forms/components/AppFormInput";
import { AiOutlineUser, AiOutlineKey } from "react-icons/ai";
import api from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setUser } from "../api/user";
import { setToken } from "../api/token";
import UserContext from "../contexts/userContext";
import WindowContext from "../contexts/windowContext";
import logo from "../assets/logo.png";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("اسم المستخدم مطلوب"),
  password: Yup.string().required("كلمة المرور مطلوبة"),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useContext(UserContext);
  const windowContext = useContext(WindowContext);
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      await api.get(
        `${process.env.REACT_APP_API_ABSOLUTE}/sanctum/csrf-cookie`
      );

      const res = await api.post("/login", {
        username: values.username,
        password: values.password,
      });

      userContext.setUser(res.data.user);
      setUser(res.data.user);
      setToken(res.data.token);

      navigate("/dashboard/archive");
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("خطأ في اسم المستخدم او كلمة المرور!");
      } else {
        toast.error("حدث خطأ داخلي الرجاء إعادة المحاولة!");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-screen overflow-clip flex justify-center items-center  bg-slate-200">
      <div className="w-full md:w-3/6 lg:w-3/12 bg-white shadow shadow-gray flex flex-col items-center relative rounded-lg">
        <img
          src={logo}
          alt="logo"
          className="w-32 h-32 rounded-full absolute -top-16 border-8 border-slate-200"
        />

        <h2 className="text-dark my-4 text-lg lg:text-xl mt-20">
          تسجيل الدخول
        </h2>
        <div className="flex flex-col w-full px-7 2xl:px-14 pb-10">
          <div dir="rtl" className={`flex flex-col justify-center relative`}>
            <AppForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => handleLogin(values)}
            >
              <AppInput
                id={"username"}
                label={"اسم المستخدم:"}
                placeholder={"ادخل اسم المستخدم"}
                type="text"
                Icon={AiOutlineUser}
              />
              <AppInput
                id={"password"}
                label={"كلمة المرور:"}
                placeholder={"ادخل كلمة المرور"}
                type="password"
                Icon={AiOutlineKey}
              />
              <AppSubmitButton isLoading={isLoading}>
                تسجيل الدخول
              </AppSubmitButton>
            </AppForm>
          </div>
        </div>
        <div className="h-full w-full flex justify-end items-end">
          <div className="h-2 bg-primary w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
