import { useContext, useState } from "react";
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
import AppFormSelect from "../forms/components/AppFormSelect";
import AppFileInput from "../AppFileInput";
import { Form, Formik } from "formik";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("لا يمكن أن يكون حقل الاسم فارغ"),
});

const FolderAdd = ({ isOpen, setIsOpen, setFSEs, parent }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  let initialValues = {
    name: "",
    is_directory: true,
  };

  const handleSubmit = async (values) => {
    setIsUpdating(true);

    try {
      const res = await api.post(`/documents/${parent}/create`, values);
      onClose();
      toast.success("تمت العملية بنجاح");
      if (setFSEs) {
        setFSEs((old) => [{ ...res.data, is_directory: true }, ...old]);
      }
    } catch (error) {
      if (error.response.status === 403) {
        toast.error("عذراً لا تملك صلاحية");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"إضافة مجلد"}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {() => (
          <>
            <AppInput
              id={"name"}
              placeholder={"الاسم"}
              label={"الاسم:"}
              containerClassName="grow"
            />

            <div className="grid grid-cols-2 gap-10 justify-between">
              <AppButton
                type="button"
                onClick={() => setIsOpen(false)}
                className={
                  "border-dark text-dark hover:bg-dark hover:text-white"
                }
              >
                إلغاء
              </AppButton>
              <AppSubmitButton isLoading={isUpdating}>إضافة</AppSubmitButton>
            </div>
          </>
        )}
      </Formik>
    </AppModal>
  );
};

export default FolderAdd;
