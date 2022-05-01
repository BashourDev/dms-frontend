import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import UserContext from "../../contexts/userContext";
import AppButton from "../AppButton";
import AppModal from "./AppModal";
import AppForm from "../forms/components/AppForm";
import api from "../../api/api";
import AppInput from "../forms/components/AppFormInput";
import AppFormSwitch from "../forms/components/AppFormSwitch";
import AppSubmitButton from "../forms/components/AppSubmitButton";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("لا يمكن أن يكون حقل اسم المستخدم فارغ"),
  password: Yup.string().required("لا يمكن أن تكون كلمة المرور فارغة"),
});

const UserUpdate = ({ user, isOpen, setIsOpen, setUsers }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialValues, setInitialValues] = useState({
    username: "",
    password: "",
  });

  //   const getUser = async () => {
  //     const res = await api.get(`/users/${id}`);
  //     setInitialValues(res.data);
  //   };

  useEffect(() => {
    setInitialValues({
      username: user.username,
      password: "",
    });
  }, [user]);

  const handleSubmit = async (values) => {
    setIsUpdating(true);
    try {
      const res = await api.put(`/users/${user.id}/update`, {
        ...values,
        is_admin: false,
      });

      toast.success("تمت العملية بنجاح");
      setErrorMessage("");
      if (setUsers) {
        setUsers((old) =>
          old.map((u) => {
            if (u.id === user.id) {
              u.username = res.data.username;
            }
            return u;
          })
        );
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        setErrorMessage("اسم المستخدم محجوز, الرجاء استخدام اسم آخر");
      }
    }
    setIsUpdating(false);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"تعديل مستخدم"}>
      <AppForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {errorMessage && <span className="text-danger">{errorMessage}</span>}
        <div className="grid grid-cols-2 gap-5">
          <AppInput
            id={"username"}
            placeholder={"اسم المستخدم"}
            label={"اسم المستخدم:"}
            containerClassName="grow"
          />
          <AppInput
            id={"password"}
            placeholder={"كلمة المرور"}
            label={"كلمة المرور:"}
            containerClassName="grow"
          />
        </div>

        <div className="grid grid-cols-2 gap-10 justify-between">
          <AppButton
            type="button"
            onClick={() => setIsOpen(false)}
            className={"border-dark text-dark hover:bg-dark hover:text-white"}
          >
            إلغاء
          </AppButton>
          <AppSubmitButton isLoading={isUpdating}>تعديل</AppSubmitButton>
        </div>
      </AppForm>
    </AppModal>
  );
};

export default UserUpdate;
