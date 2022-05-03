import React from "react";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import { FaFile, FaFileArchive } from "react-icons/fa";
import { MdDelete, MdEdit, MdLock } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../api/api";
import { conf } from "./appConfirm";

const AppFile = ({
  id,
  name,
  setFSEs,
  setSelectedFile,
  setIsEditOpen,
  setIsVersionsOpen,
  setIsPermissionsOpen,
}) => {
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

  const handleAllVersions = () => {
    setSelectedFile(id);
    setIsVersionsOpen(true);
  };

  const handlePermissions = () => {
    setSelectedFile(id);
    setIsPermissionsOpen(true);
  };

  return (
    <>
      <ContextMenuTrigger id={"" + id}>
        <div className="flex flex-col w-20">
          <FaFile className="text-7xl text-dark hover:opacity-95 peer" />
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
          onClick={() => handleAllVersions()}
          className="flex items-center cursor-pointer hover:bg-light px-2 py-1"
        >
          <FaFileArchive className="text-dark text-lg ml-2" />
          <span>جميع النسخ</span>
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

export default AppFile;
