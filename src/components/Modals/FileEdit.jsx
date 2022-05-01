import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import UserContext from "../../contexts/userContext";
import AppButton from "../AppButton";
import AppModal from "./AppModal";
import AppForm from "../forms/components/AppForm";
import api from "../../api/api";
import AppFormInput from "../forms/components/AppFormInput";
import AppFormSwitch from "../forms/components/AppFormSwitch";
import AppSubmitButton from "../forms/components/AppSubmitButton";
import { toast } from "react-toastify";
import AppFormSelect from "../forms/components/AppFormSelect";
import AppFileInput from "../AppFileInput";
import { Form, Formik } from "formik";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("لا يمكن أن يكون حقل الاسم فارغ"),
});

const FileEdit = ({ isOpen, setIsOpen, setFSEs, parent, selectedFile }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  //   const [fileName, setFileName] = useState("");
  const [categories, setCategories] = useState([]);
  //   const [fileNameError, setFileNameError] = useState("");
  const [initialValues, setInitialValues] = useState({
    name: "",
    category: { id: 0, name: "---", custom_path: "---" },
    due_date: "",
    require_approval: false,
    group_approval_id: { id: 0, name: "---" },
    is_directory: false,
  });

  const getCategories = async () => {
    const res = await api.get("/categories/last-level");
    setCategories(res.data);
  };

  const getFile = async () => {
    if (selectedFile === 0) {
      return;
    }
    const res = await api.get(`/documents/${selectedFile}/show`);

    setInitialValues({
      ...res.data,
      require_approval: res.data.group_approval_id ? true : false,
      category: res.data.category
        ? res.data.category
        : { id: 0, name: "---", custom_path: "---" },
      group_approval_id: res.data.group_approval
        ? res.data.group_approval
        : { id: 0, name: "---" },
    });
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getFile();
  }, [selectedFile]);

  //   useEffect(() => {
  //     setFileName(selectedFile?.name);
  //   }, [selectedFile]);

  //   useEffect(() => {
  //     setInitialValues({
  //       // name: "",
  //       category: { id: 0, name: "---" },
  //       due_date: "",
  //       require_approval: false,
  //       group_approval_id: { id: 0, name: "---" },
  //       is_directory: false,
  //     });
  //     setFileName("");
  //   }, [isOpen]);

  //   useEffect(() => {
  //     if (!fileName) {
  //       setFileNameError("لا يمكن أن يكون حقل الاسم فارغ");
  //       return;
  //     } else {
  //       setFileNameError("");
  //     }
  //   }, [fileName]);

  const handleSubmit = async (values) => {
    // if (!fileName) {
    //   setFileNameError("لا يمكن أن يكون حقل الاسم فارغ");
    //   return;
    // } else {
    //   setFileNameError("");
    // }
    setIsUpdating(true);

    // let formData = new FormData();
    // formData.append("name", values.name);
    // formData.append(
    //   "category",
    //   values.category.id === 0 ? "" : values.category.id
    // );
    // formData.append("due_date", values.due_date);
    // formData.append(
    //   "group_approval_id",
    //   values.group_approval_id.id === 0 ? "" : values.group_approval_id.id
    // );
    // formData.append("is_directory", 0);
    try {
      await api.put(`/documents/${selectedFile}/update`, {
        name: values.name,
        category: values.category.id === 0 ? "" : values.category.id,
        due_date: values.due_date,
        group_approval_id:
          values.group_approval_id.id === 0 ? "" : values.group_approval_id.id,
        is_directory: false,
      });
      onClose();
      toast.success("تمت العملية بنجاح");
      if (setFSEs) {
        setFSEs((old) =>
          old.map((fse) => {
            if (fse.id === selectedFile) {
              fse.name = values.name;
            }
            return fse;
          })
        );
      }
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"تعديل ملف"}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values }) => (
          <>
            <AppFormInput
              id={"name"}
              placeholder={"الإسم"}
              label={"الإسم:"}
              containerClassName="grow"
            />
            <AppFormInput
              id={"due_date"}
              placeholder={"تاريخ الانتهاء"}
              label={"تاريخ الانتهاء:"}
              type="date"
              containerClassName="grow"
            />
            <AppFormSelect
              name={"category"}
              label={"التصنيف:"}
              options={categories}
              displayedName={"custom_path"}
            />
            <div
              className={`flex items-center w-full ${
                values?.require_approval ? "pt-0" : " pt-5"
              }`}
            >
              <AppFormSwitch name={"require_approval"} text={"طلب موافقة"} />
              {values?.require_approval && (
                <AppFormSelect
                  name={"group_approval_id"}
                  label={"من المجموعة:"}
                  options={[]}
                />
              )}
            </div>
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

export default FileEdit;
