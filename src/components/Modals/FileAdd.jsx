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
import AppSelectTags from "../AppSelectTags";
import Tags from "./Tags";
import { AiOutlinePlus } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import AppFormTextArea from "../forms/components/AppFormTextArea";

const validationSchema = Yup.object().shape({
  // name: Yup.string().required("لا يمكن أن يكون حقل الاسم فارغ"),
});

const FileAdd = ({ isOpen, setIsOpen, setFSEs, parent }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [categories, setCategories] = useState([]);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [fileNameError, setFileNameError] = useState("");
  const [initialValues, setInitialValues] = useState({
    // name: "",
    description: "",
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

  const getTags = async () => {
    const res = await api.get("/tags");
    setTags(res.data);
  };

  const handleTagsChange = (tag) => {
    setSelectedTags((old) => [...old, tag]);
  };

  const handleTagsRemove = (sTag) => {
    setSelectedTags((old) => old.filter((tag) => tag.id !== sTag.id));
  };

  useEffect(() => {
    getTags();
  }, [isTagsOpen]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setFileName(selectedFile?.name);
  }, [selectedFile]);

  useEffect(() => {
    setInitialValues({
      // name: "",
      category: { id: 0, name: "---", custom_path: "---" },
      due_date: "",
      require_approval: false,
      group_approval_id: { id: 0, name: "---" },
      is_directory: false,
    });
    setFileName("");
    setFileNameError("");
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
    formData.append("description", values?.description);
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
    formData.append("tags", JSON.stringify(selectedTags));
    try {
      const res = await api.post(`/documents/${parent}/create`, formData);
      onClose();
      toast.success("تمت العملية بنجاح");
      if (setFSEs) {
        setFSEs((old) => [{ ...res.data, is_directory: false }, ...old]);
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
    <AppModal isOpen={isOpen} onClose={onClose} title={"إضافة ملف"}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values }) => (
          <>
            <div className="max-h-[70vh] overflow-auto">
              <AppFileInput
                label={"اختر ملف"}
                selectedFile={selectedFile}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <div className={`flex flex-col`}>
                <label
                  htmlFor={"name"}
                  className="text-dark text-xs lg:text-sm focus:text-primary mb-1 mx-1 focus-within:text-primary"
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
              <AppFormTextArea
                id={"description"}
                placeholder={"الوصف"}
                label={"الوصف:"}
                containerClassName="grow"
              />
              <div className="grid grid-cols-6 items-center col-span-6 gap-x-1">
                <AppSelectTags
                  label="اختر وسم:"
                  placeholder={"وسم الملف"}
                  className={"col-span-5"}
                  options={tags}
                  handleChange={handleTagsChange}
                />
                <AppButton
                  className="col-span-1 mt-8 px-0 flex items-center justify-center"
                  onClick={() => setIsTagsOpen(true)}
                >
                  {<AiOutlinePlus className="self-center text-xl" />}
                </AppButton>
              </div>
              <div className="flex flex-wrap">
                {selectedTags.map((item, i) => (
                  <div
                    key={i}
                    className="bg-primary text-white h-7 rounded-full m-1 px-2 flex justify-between items-center w-fit"
                  >
                    <span className="flex items-center px-2 text-sm">
                      {item?.name}
                    </span>
                    <MdCancel
                      onClick={() => handleTagsRemove(item)}
                      className="text-lg cursor-pointer"
                    />
                  </div>
                ))}
              </div>
              <AppFormInput
                id={"due_date"}
                placeholder={"تاريخ المتابعة"}
                label={"تاريخ المتابعة:"}
                type="date"
                containerClassName="grow"
              />
              <AppFormSelect
                name={"category"}
                label={"التصنيف:"}
                options={categories}
                displayedName={"custom_path"}
              />
              {/* <div
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
              </div> */}
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
      <Tags isOpen={isTagsOpen} setIsOpen={setIsTagsOpen} />
    </AppModal>
  );
};

export default FileAdd;
