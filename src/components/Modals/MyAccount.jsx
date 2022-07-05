import { useContext, useState } from "react";
import * as Yup from "yup";
import UserContext from "../../contexts/userContext";
import AppButton from "../AppButton";
import AppModal from "./AppModal";
import AppForm from "../forms/components/AppForm";
import api from "../../api/api";
import { setUser } from "../../api/user";
import AppInput from "../forms/components/AppFormInput";
import AppFormSwitch from "../forms/components/AppFormSwitch";
import AppSubmitButton from "../forms/components/AppSubmitButton";
import { Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { Formik } from "formik";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("لا يمكن أن يكون حقل اسم المستخدم فارغ"),
  oldPassword: Yup.string().when("updatePassword", {
    is: true,
    then: Yup.string().required("الرجاء إدخال كلمة المرور الحالية"),
  }),
  password: Yup.string().when("updatePassword", {
    is: true,
    then: Yup.string().required("الرجاء إدخال كلمة المرور الجديدة"),
  }),
  passwordConfirmation: Yup.string().when("updatePassword", {
    is: true,
    then: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "يجب أن تكون كلمات المرور مطابقة"
    ),
  }),
});

const MyAccount = ({ isOpen, setIsOpen }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const userContext = useContext(UserContext);

  const EditAccount = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    let initialValues = {
      username: userContext.user.username,
      updatePassword: false,
      oldPassword: "",
      password: "",
      passwordConfirmation: "",
    };

    const handleSubmit = async (values) => {
      setIsUpdating(true);
      try {
        const res = await api.put("/update-current-user", values);
        setUser(res.data);
        userContext.setUser(res.data);
        toast.success("تمت العملية بنجاح");
        setIsEdit(false);
        setErrorMessage("");
      } catch (error) {
        if (error?.response?.status === 422) {
          setErrorMessage("اسم المستخدم محجوز, الرجاء استخدام اسم آخر");
        }
        if (error?.response?.status === 403) {
          setErrorMessage("كلمة المرور الحالية غير صحيحة");
        }
      }
      setIsUpdating(false);
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize
      >
        {({ values }) => (
          <>
            {errorMessage && (
              <span className="text-danger">{errorMessage}</span>
            )}

            <AppInput
              id={"username"}
              placeholder={"اسم المستخدم"}
              label={"اسم المستخدم:"}
              containerClassName="grow"
            />
            <div className="flex py-4">
              <AppFormSwitch name="updatePassword" text={"تعديل كلمة المرور"} />
            </div>
            {values?.updatePassword ? (
              <>
                <AppInput
                  id={"oldPassword"}
                  placeholder={"كلمة المرور الحالية"}
                  label={"كلمة المرور الحالية:"}
                  type="password"
                  containerClassName="grow"
                  disabledValue={"updatePassword"}
                />
                <AppInput
                  id={"password"}
                  placeholder={"كلمة المرور الجديدة"}
                  label={"كلمة المرور الجديدة:"}
                  type="password"
                  containerClassName="grow"
                  disabledValue={"updatePassword"}
                />
                <AppInput
                  id={"passwordConfirmation"}
                  placeholder={"أعد كتابة كلمة المرور الجديدة"}
                  label={"تأكيد كلمة المرور الجديدة:"}
                  type="password"
                  containerClassName="grow"
                  disabledValue={"updatePassword"}
                />
              </>
            ) : null}
            <div className="grid grid-cols-2 gap-10 justify-between">
              <AppButton
                type="button"
                onClick={() => setIsEdit(false)}
                className={
                  "border-dark text-dark hover:bg-dark hover:text-white"
                }
              >
                إلغاء
              </AppButton>
              <AppSubmitButton isLoading={isUpdating}>تعديل</AppSubmitButton>
            </div>
          </>
        )}
      </Formik>
    );
  };

  const onClose = () => {
    setIsOpen(false);
    setIsEdit(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"حسابي"}>
      {isEdit ? (
        <EditAccount />
      ) : (
        <>
          <div className="flex mt-3">
            <label className="ml-2">اسم المستخدم:</label>
            <span>{userContext.user.username}</span>
          </div>
          <div className="flex">
            <label className="ml-2">الصلاحية:</label>
            <span>{userContext.user.is_admin ? "مدير" : "موظف"}</span>
          </div>
          <div className="flex mt-4 mb-1">
            <AppButton
              onClick={() => setIsEdit(true)}
              className={
                "border-light mt-0 mb-0 text-light bg-sky-700 hover:bg-sky-800 disabled:text-light disabled:bg-lightGray disabled:hover:bg-light disabled:hover:text-lightGray w-36 border-4"
              }
            >
              {"تعديل"}
            </AppButton>
            <AppButton
              onClick={() => setIsOpen(false)}
              className={
                "border-light mt-0 mb-0 text-sky-700 bg-sky-light hover:bg-sky-100 hover:text-sky-700 disabled:text-light disabled:bg-lightGray disabled:hover:bg-light disabled:hover:text-lightGray w-36 border-4"
              }
            >
              {"إغلاق"}
            </AppButton>
          </div>
        </>
      )}
    </AppModal>
  );
};

export default MyAccount;
