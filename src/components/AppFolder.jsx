import React from "react";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import { FaFolder } from "react-icons/fa";
import { MdDelete, MdEdit, MdLock } from "react-icons/md";

const AppFolder = ({ id, name, getDocuments }) => {
  const handleDoubleClick = async () => {
    getDocuments(id);
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
          onClick={() => console.log("sss")}
          className="flex items-center cursor-pointer hover:bg-light px-2 py-1"
        >
          <MdEdit className="text-info text-lg ml-2" />
          <span>تعديل</span>
        </MenuItem>
        <MenuItem divider className="cursor-pointer bg-lightGray h-[1px]" />
        <MenuItem
          data={{ foo: "bar" }}
          onClick={() => console.log("sss")}
          className="flex items-center cursor-pointer hover:bg-light px-2 py-1"
        >
          <MdDelete className="text-danger text-lg ml-2" />
          <span>حذف</span>
        </MenuItem>
        <MenuItem divider className="cursor-pointer bg-lightGray h-[1px]" />
        <MenuItem
          data={{ foo: "bar" }}
          onClick={() => console.log("sss")}
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
