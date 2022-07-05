import React, { useContext } from "react";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import { FaFile, FaFileArchive } from "react-icons/fa";
import { MdClose, MdDelete, MdDownload, MdEdit, MdLock } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../api/api";
import { conf } from "./appConfirm";
import FileDownload from "js-file-download";
import UserContext from "../contexts/userContext";
import moment from "../myMoment";
import { BsCollectionFill } from "react-icons/bs";

const AppReminderFile = ({
  id,
  name,
  dueDate,
  setFSEs,
  setSelectedFile,
  setIsEditOpen,
  setIsVersionsOpen,
  setIsPermissionsOpen,
  media = [],
  permissions,
  setSelectedFilePermissions,
  setReminderCount,
}) => {
  const userContext = useContext(UserContext);

  const handleEdit = () => {
    setSelectedFile(id);
    setIsEditOpen(true);
  };

  const handleDelete = async () => {
    let result = await conf(" هل أنت متأكد من حذف الملف " + name + "؟");

    if (!result) {
      return;
    }

    try {
      await api.delete(`/documents/${id}/delete`);
      toast.success("تمت العملية بنجاح");
      setFSEs((old) => old.filter((fse) => fse.id !== id));
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleDownload = async () => {
    let newMedia = media.map((m) => m.id);
    let maxMedia = Math.max(...newMedia);
    let lastMedia = media.find((m) => m.id === maxMedia);

    const res = await api.get(`/documents/${id}/media/${maxMedia}/download`, {
      responseType: "blob",
    });
    FileDownload(res.data, lastMedia?.file_name);
  };

  const handleAllVersions = () => {
    setSelectedFilePermissions(permissions);
    setSelectedFile(id);
    setIsVersionsOpen(true);
  };

  const handlePermissions = () => {
    setSelectedFile(id);
    setIsPermissionsOpen(true);
  };

  const handleRemoveReminder = async () => {
    try {
      await api.delete(`/users/file-system-entries/${id}/mark-as-read`);
      setFSEs((old) => old.filter((o) => o.id !== id));
      setReminderCount((old) => old - 1);
    } catch (error) {
      toast.error("عذراً حدث خطأ");
    }
  };

  return (
    <div className="relative">
      <ContextMenuTrigger id={"www" + id}>
        <div className="flex min-w-full">
          <FaFile className="text-7xl text-dark hover:opacity-95 peer" />
          <div className="flex justify-between">
            <div className="flex flex-col justify-between w-full">
              <p className="text-dark text-xs md:text-sm peer-hover:opacity-95 pr-2">
                {name}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-dark/80 text-xs md:text-sm peer-hover:opacity-95 pr-2">
                  {dueDate ? moment(dueDate).calendar() : null}
                </p>
                <div className="flex items-center w-full">
                  {userContext?.user?.is_admin || permissions?.upload ? (
                    <>
                      <button
                        onClick={() => handleEdit()}
                        className="flex items-center justify-center cursor-pointer hover:bg-light px-2 py-1"
                      >
                        <MdEdit className="text-info text-lg" />
                      </button>
                    </>
                  ) : null}
                  {userContext?.user?.is_admin || permissions?.delete ? (
                    <>
                      <div className="cursor-pointer bg-lightGray h-[1px]" />
                      <button
                        onClick={() => handleDelete()}
                        className="flex items-center justify-center cursor-pointer hover:bg-light px-2 py-1"
                      >
                        <MdDelete className="text-danger text-lg" />
                      </button>
                    </>
                  ) : null}
                  {userContext?.user?.is_admin || permissions?.download ? (
                    <>
                      <div className="cursor-pointer bg-lightGray h-[1px]" />
                      <button
                        onClick={() => handleDownload()}
                        className="flex items-center justify-center cursor-pointer hover:bg-light px-2 py-1"
                      >
                        <MdDownload className="text-primary text-lg" />
                      </button>
                    </>
                  ) : null}
                  <div className="cursor-pointer bg-lightGray h-[1px]" />
                  <button
                    onClick={() => handleAllVersions()}
                    className="flex items-center justify-center cursor-pointer hover:bg-light px-2 py-1"
                  >
                    <BsCollectionFill className="text-dark text-lg" />
                  </button>
                  {userContext?.user?.is_admin ? (
                    <>
                      <div className="cursor-pointer bg-lightGray h-[1px]" />
                      <button
                        onClick={() => handlePermissions()}
                        className="flex items-center justify-center cursor-pointer hover:bg-light px-2 py-1"
                      >
                        <MdLock className="text-dark text-lg" />
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <button>
              <MdClose
                className="text-xl mx-1"
                onClick={() => handleRemoveReminder()}
              />
            </button>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenu
        id={"www" + id}
        className="rounded bg-white shadow-xl py-2 space-y-2 w-44 absolute z-[7000]"
      >
        {userContext?.user?.is_admin || permissions?.upload ? (
          <>
            <MenuItem
              data={{ foo: "bar" }}
              onClick={() => handleEdit()}
              className="flex items-center cursor-pointer hover:bg-light px-2 py-1"
            >
              <MdEdit className="text-info text-lg ml-2" />
              <span>تعديل</span>
            </MenuItem>
          </>
        ) : null}
        {userContext?.user?.is_admin || permissions?.delete ? (
          <>
            <MenuItem divider className="cursor-pointer bg-lightGray h-[1px]" />
            <MenuItem
              data={{ foo: "bar" }}
              onClick={() => handleDelete()}
              className="flex items-center cursor-pointer hover:bg-light px-2 py-1"
            >
              <MdDelete className="text-danger text-lg ml-2" />
              <span>حذف</span>
            </MenuItem>
          </>
        ) : null}
        {userContext?.user?.is_admin || permissions?.download ? (
          <>
            <MenuItem divider className="cursor-pointer bg-lightGray h-[1px]" />
            <MenuItem
              data={{ foo: "bar" }}
              onClick={() => handleDownload()}
              className="flex items-center cursor-pointer hover:bg-light px-2 py-1"
            >
              <MdDownload className="text-primary text-lg ml-2" />
              <span>تحميل</span>
            </MenuItem>
          </>
        ) : null}
        <MenuItem divider className="cursor-pointer bg-lightGray h-[1px]" />
        <MenuItem
          data={{ foo: "bar" }}
          onClick={() => handleAllVersions()}
          className="flex items-center cursor-pointer hover:bg-light px-2 py-1"
        >
          <BsCollectionFill className="text-dark text-lg ml-2" />
          <span>جميع النسخ</span>
        </MenuItem>
        {userContext?.user?.is_admin ? (
          <>
            <MenuItem divider className="cursor-pointer bg-lightGray h-[1px]" />
            <MenuItem
              data={{ foo: "bar" }}
              onClick={() => handlePermissions()}
              className="flex items-center cursor-pointer hover:bg-light px-2 py-1"
            >
              <MdLock className="text-dark text-lg ml-2" />
              <span>صلاحيات</span>
            </MenuItem>
          </>
        ) : null}
      </ContextMenu>
    </div>
  );
};

export default AppReminderFile;
