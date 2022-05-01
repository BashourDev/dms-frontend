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
  name: Yup.string().required("لا يمكن أن يكون حقل اسم المجموعة فارغ"),
});

const UserUpdate = ({ group, isOpen, setIsOpen, setGroups }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialValues, setInitialValues] = useState({
    name: "",
  });

  //   const getUser = async () => {
  //     const res = await api.get(`/users/${id}`);
  //     setInitialValues(res.data);
  //   };

  useEffect(() => {
    setInitialValues({
      name: group.name,
    });
  }, [group]);

  const handleSubmit = async (values) => {
    setIsUpdating(true);
    try {
      const res = await api.put(`/groups/${group.id}/update`, values);

      toast.success("تمت العملية بنجاح");
      setErrorMessage("");
      if (setGroups) {
        setGroups((old) =>
          old.map((g) => {
            if (g.id === group.id) {
              g.name = res.data.name;
            }
            return g;
          })
        );
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        setErrorMessage("اسم المجموعة محجوز, الرجاء استخدام اسم آخر");
      }
    }
    setIsUpdating(false);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"تعديل مجموعة"}>
      <AppForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {errorMessage && <span className="text-danger">{errorMessage}</span>}
        <AppInput
          id={"name"}
          placeholder={"اسم المجموعة"}
          label={"اسم المجموعة:"}
          containerClassName="grow"
        />

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
