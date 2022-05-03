import React from "react";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import { FaFolder } from "react-icons/fa";
import { MdDelete, MdEdit, MdLock } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../api/api";
import { conf } from "./appConfirm";

const AppFolder = ({
  id,
  name,
  getDocuments,
  setFSEs,
  setSelectedFolder,
  setIsEditOpen,
  setIsPermissionsOpen,
  setSelectedFile,
}) => {
  const handleDoubleClick = async () => {
    getDocuments(id);
  };

  const handleEdit = () => {
    setSelectedFolder(id);
    setIsEditOpen(true);
  };

  const handleDelete = async () => {
    let result = await conf(" هل أنت متأكد من حذف المجلد " + name + "؟");

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

  const handlePermissions = () => {
    setSelectedFile(id);
    setIsPermissionsOpen(true);
  };

  return (
    <>
      <ContextMenuTrigger id={"" + id}>
        <div className="flex flex-col">
          <FaFolder
            onDoubleClick={() => handleDoubleClick()}
            className="text-7xl text-dark hover:opacity-95 peer w-20"
          />
          <p className="text-dark text-xs md:text-sm peer-hover:opacity-95 pr-2">
            {name}
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenu
        id={"" + id}
        className="rounded bg-white shadow-xl py-2 space-y-2 w-44 z-[3000]"
      >
        <MenuItem
          data={{ foo: "bar" }}
          onClick={() => handleEdit()}
          className="flex items-center cursor-pointer hover:bg-light px-2 py-1"
        >
          <MdEdit className="text-info text-lg ml-2" />
          <span>تعديل</span>
        </MenuItem>
        <MenuItem divider className="cursor-pointer bg-lightGray h-[1px]" />
        <MenuItem
          data={{ foo: "bar" }}
          onClick={() => handleDelete()}
          className="flex items-center cursor-pointer hover:bg-light px-2 py-1"
        >
          <MdDelete className="text-danger text-lg ml-2" />
          <span>حذف</span>
        </MenuItem>
        <MenuItem divider className="cursor-pointer bg-lightGray h-[1px]" />
        <MenuItem
          data={{ foo: "bar" }}
          onClick={() => handlePermissions()}
          className="flex items-center cursor-pointer hover:bg-light px-2 py-1"
        >
          <MdLock className="text-dark text-lg ml-2" />
          <span>صلاحيات</span>
        </MenuItem>
      </ContextMenu>
    </>
  );
};

export default AppFolder;
