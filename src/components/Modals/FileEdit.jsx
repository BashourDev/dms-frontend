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
import AppFormTextArea from "../forms/components/AppFormTextArea";
import AppSelectTags from "../AppSelectTags";
import { AiOutlinePlus } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import Tags from "./Tags";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("لا يمكن أن يكون حقل الاسم فارغ"),
});

const FileEdit = ({ isOpen, setIsOpen, setFSEs, parent, selectedFile }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  //   const [fileName, setFileName] = useState("");
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [categories, setCategories] = useState([]);
  //   const [fileNameError, setFileNameError] = useState("");
  const [initialValues, setInitialValues] = useState({
    name: "",
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

  const getFSETags = async () => {
    if (selectedFile === 0) {
      return;
    }
    const res = await api.get(`/documents/${selectedFile}/tags`);
    setSelectedTags(res.data);
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

  const getFile = async () => {
    if (selectedFile === 0) {
      return;
    }
    const res = await api.get(`/documents/${selectedFile}/show`);

    setInitialValues({
      ...res.data,
      require_approval: res.data.group_approval_id ? true : false,
      category: res.data.category_full
        ? res.data.category_full
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
    getFSETags();
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
        description: values?.description,
        category: values.category.id === 0 ? "" : values.category.id,
        due_date: values.due_date,
        group_approval_id:
          values.group_approval_id.id === 0 ? "" : values.group_approval_id.id,
        tags: JSON.stringify(selectedTags),
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
    <AppModal isOpen={isOpen} onClose={onClose} title={"تعديل ملف"}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values }) => (
          <>
            <div className="max-h-[70vh] overflow-auto">
              <AppFormInput
                id={"name"}
                placeholder={"الإسم"}
                label={"الإسم:"}
                containerClassName="grow"
              />
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
              <AppSubmitButton isLoading={isUpdating}>تعديل</AppSubmitButton>
            </div>
          </>
        )}
      </Formik>
      <Tags isOpen={isTagsOpen} setIsOpen={setIsTagsOpen} />
    </AppModal>
  );
};

export default FileEdit;
