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
  // name: Yup.string().required("لا يمكن أن يكون حقل الاسم فارغ"),
});

const FileAdd = ({ isOpen, setIsOpen, setFSEs, parent }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [categories, setCategories] = useState([]);
  const [fileNameError, setFileNameError] = useState("");
  const [initialValues, setInitialValues] = useState({
    // name: "",
    category: { id: 0, name: "---" },
    due_date: "",
    require_approval: false,
    group_approval_id: { id: 0, name: "---" },
    is_directory: false,
  });

  const getCategories = async () => {
    const res = await api.get("/categories/last-level");
    setCategories(res.data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setFileName(selectedFile?.name);
  }, [selectedFile]);

  useEffect(() => {
    setInitialValues({
      // name: "",
      category: { id: 0, name: "---" },
      due_date: "",
      require_approval: false,
      group_approval_id: { id: 0, name: "---" },
      is_directory: false,
    });
    setFileName("");
  }, [isOpen]);

  useEffect(() => {
    if (!fileName) {
      setFileNameError("لا يمكن أن يكون حقل الاسم فارغ");
      return;
    } else {
      setFileNameError("");
    }
  }, [fileName]);

  const handleSubmit = async (values) => {
    if (!fileName) {
      setFileNameError("لا يمكن أن يكون حقل الاسم فارغ");
      return;
    } else {
      setFileNameError("");
    }
    setIsUpdating(true);

    let formData = new FormData();
    formData.append("name", fileName);
    formData.append(
      "category",
      values.category.id === 0 ? "" : values.category.id
    );
    formData.append("due_date", values.due_date);
    formData.append(
      "group_approval_id",
      values.group_approval_id.id === 0 ? "" : values.group_approval_id.id
    );
    formData.append("is_directory", 0);
    formData.append("attachment", selectedFile);
    try {
      const res = await api.post(`/documents/${parent}/create`, formData);
      onClose();
      toast.success("تمت العملية بنجاح");
      if (setFSEs) {
        setFSEs((old) => [{ ...res.data, is_directory: false }, ...old]);
      }
    } catch (error) {}
    setIsUpdating(false);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"إضافة ملف"}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values }) => (
          <>
            <AppFileInput
              label={"اختر ملف"}
              selectedFile={selectedFile}
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <div className={`flex flex-col`}>
              <label
                htmlFor={"name"}
                className="text-dark text-xs lg:text-sm focus:text-primary mt-5 mb-1 mx-1 focus-within:text-primary"
              >
                الإسم
              </label>
              <div
                className={`w-full h-11 border-[1px] border-lightGray transition duration-150 rounded-lg flex items-center text-dark focus-within:border-primary ${
                  fileNameError && "border-danger"
                }`}
              >
                <div className="px-2"></div>
                <input
                  type={"text"}
                  value={fileName}
                  placeholder={"ادخل اسم الملف أو قم بتحديده"}
                  onChange={(e) => setFileName(e.target.value)}
                  className="border-0 outline-none px-2 w-full bg-inherit text-xs lg:text-sm"
                />
              </div>
              {fileNameError !== "" && (
                <p className="text-danger mt-1 text-xs lg:text-sm">
                  {fileNameError}
                </p>
              )}
            </div>
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

export default FileAdd;
