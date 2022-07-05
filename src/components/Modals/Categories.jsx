import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import CategoryCard from "../CategoryCard";
import AppButton from "../AppButton";
import AppForm from "../forms/components/AppForm";
import AppFormInput from "../forms/components/AppFormInput";
import AppModal from "./AppModal";
import AppFormSelect from "../forms/components/AppFormSelect";
import * as Yup from "yup";
import AppSubmitButton from "../forms/components/AppSubmitButton";
import api from "../../api/api";
import { toast } from "react-toastify";

const CategoryForm = ({ setIsOpen }) => {
  const [all, setAll] = useState([]);
  const [subLevel, setSubLevel] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const types = [
    {
      id: 0,
      name: "المستوى الأول",
      level: "level_0",
    },
    {
      id: 1,
      name: "المستوى الثاني",
      level: "level_0",
    },
    {
      id: 2,
      name: "المستوى الثالث",
      level: "level_1",
    },
    {
      id: 3,
      name: "المستوى الرابع",
      level: "level_2",
    },
  ];

  const getSNR = async () => {
    const res = await api.get("/categories/levels");
    setAll(res.data);
  };

  useEffect(() => {
    getSNR();
  }, []);

  const create = async (values) => {
    setIsLoading(true);
    try {
      await api.post("/categories/create", {
        name: values?.name,
        parent: values?.parent?.id,
      });
      setIsOpen(false);
      toast.success("تمت العملية بنجاح");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{ level: types[0], parent: {}, name: "" }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("حقل الإسم مطلوب"),
        })}
        onSubmit={create}
      >
        {({ values }) => (
          <>
            <AppFormSelect name={"level"} label={"المستوى:"} options={types} />
            {values["level"]?.id !== 0 && (
              <AppFormSelect
                name={"parent"}
                label={"المستوى الأب:"}
                options={all[values["level"]["level"]]}
              />
            )}
            <AppFormInput
              id={"name"}
              label={"الإسم:"}
              placeholder={"ادخل الإسم"}
            />
            <div className="flex justify-around items-center py-3 gap-5">
              <AppButton
                onClick={() => setIsOpen(false)}
                className="bg-transparent text-dark border-dark hover:bg-dark"
              >
                إغلاق
              </AppButton>
              <AppSubmitButton>إضافة</AppSubmitButton>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

const Categories = ({ isOpen, setIsOpen }) => {
  const [isCreate, setIsCreate] = useState(true);
  let data = [
    { name: "cat 1", productsCount: 3 },
    { name: "cat 2", productsCount: 4 },
  ];

  const onClose = () => {
    setIsOpen(false);
    // setTimeout(() => setIsCreate(false), 1000);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"التصنيفات"}>
      {!isCreate ? (
        <>
          {data.map((item, i) => (
            <CategoryCard
              key={i}
              name={item.name}
              productsCount={item.productsCount}
            />
          ))}
          <div className="flex justify-around w-full mt-4">
            <AppButton onClick={() => setIsCreate(true)}>إضافة</AppButton>
            <AppButton
              onClick={onClose}
              className="text-dark border-dark bg-inherit"
            >
              إغلاق
            </AppButton>
          </div>
        </>
      ) : (
        <CategoryForm setIsOpen={setIsOpen} />
      )}
    </AppModal>
  );
};

export default Categories;
