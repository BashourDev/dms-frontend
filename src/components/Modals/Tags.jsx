import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import AppButton from "../AppButton";
import AppFormInput from "../forms/components/AppFormInput";
import AppModal from "./AppModal";
import * as Yup from "yup";
import AppSubmitButton from "../forms/components/AppSubmitButton";
import api from "../../api/api";

const TagForm = ({ setIsOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const create = async (values) => {
    setIsLoading(true);
    try {
      await api.post("/tags/create", values);
      setIsOpen(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{ name: "" }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("حقل الاسم مطلوب"),
        })}
        onSubmit={create}
      >
        {({ values }) => (
          <>
            <AppFormInput
              id={"name"}
              label={"الاسم:"}
              placeholder={"ادخل اسم الوسم"}
            />
            <div className="flex justify-around items-center py-3 gap-x-5">
              <AppButton className="bg-transparent text-dark border-dark hover:bg-dark">
                إلغاء
              </AppButton>
              <AppSubmitButton isLoading={isLoading}>إضافة</AppSubmitButton>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

const Tags = ({ isOpen, setIsOpen }) => {
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"Tags"}>
      <TagForm setIsOpen={setIsOpen} />
    </AppModal>
  );
};

export default Tags;
