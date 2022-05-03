import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import UserContext from "../../contexts/userContext";
import AppButton from "../AppButton";
import AppModal from "./AppModal";
import api from "../../api/api";
import { FaFile } from "react-icons/fa";
import moment from "../../myMoment";
import { MdAdd, MdDelete, MdDownload } from "react-icons/md";
import { toast } from "react-toastify";
import Loading from "../Loading";
import FileDownload from "js-file-download";

const validationSchema = Yup.object().shape({
  // name: Yup.string().required("لا يمكن أن يكون حقل الاسم فارغ"),
});

const FileVersions = ({ isOpen, setIsOpen, selectedFile }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [file, setFile] = useState({ media: [] });

  const getVersions = async () => {
    if (selectedFile === 0) {
      return;
    }
    const res = await api.get(`/documents/${selectedFile}/versions`);
    setFile(res.data);
  };

  useEffect(() => {
    getVersions();
  }, [isOpen]);

  const handleAdd = async (f) => {
    setIsUpdating(true);
    try {
      let formData = new FormData();
      formData.append("attachment", f);
      const res = await api.post(
        `/documents/${selectedFile}/versions/add`,
        formData
      );
      setFile(res.data);
      toast.success("تمت العملية بنجاح");
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (version) => {
    const res = await api.delete(
      `/documents/${selectedFile}/versions/${version}/delete`
    );
    setFile(res.data);
  };

  const handleDownload = async (version, name) => {
    const res = await api.get(`/documents/media/${version}/download`, {
      responseType: "blob",
    });
    FileDownload(res.data, name);
    // console.log(res.data);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"جميع نسخ الملف"}>
      <span className="text-lg w-full">{file?.name}</span>
      <div className="flex  flex-wrap py-7 gap-5">
        {file?.media?.map((v) => (
          <div key={v?.id} className="flex flex-col items-end max-w-[60px]">
            <FaFile className="text-6xl text-dark" />
            <p className="flex flex-wrap text-dark text-xs px-2">
              {moment(v?.created_at).calendar()}
            </p>
            <div className="flex justify-around w-full pt-2">
              <MdDownload
                onClick={() => handleDownload(v?.id, v?.file_name)}
                className="text-xl text-primary cursor-pointer"
              />
              <MdDelete
                onClick={() => handleDelete(v?.id)}
                className="text-xl text-danger cursor-pointer"
              />
            </div>
          </div>
        ))}
        <label className="w-16 h-16 rounded bg-primary/20 cursor-pointer">
          <span className="w-full h-full flex items-center justify-center">
            {isUpdating ? (
              <Loading className="w-8 h-8" />
            ) : (
              <MdAdd className="text-xl" />
            )}
          </span>
          <input
            type="file"
            className="hidden"
            multiple
            onChange={(e) => handleAdd(e.target.files[0])}
          />
        </label>
      </div>
    </AppModal>
  );
};

export default FileVersions;
