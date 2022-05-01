import React from "react";
import { MdClose, MdDelete, MdDone, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../api/api";
import { conf } from "../components/appConfirm";

const GroupsTable = ({
  groups = [],
  setGroups,
  setSelectedGroup,
  setIsUpdateOpen,
  setIsUsersOpen,
}) => {
  const handleEdit = (group) => {
    setIsUpdateOpen(true);
    setSelectedGroup(group);
  };

  const handleUsersOpen = (group) => {
    setIsUsersOpen(true);
    setSelectedGroup(group);
  };

  const handleDelete = async (group) => {
    let result = await conf("هل أنت متأكد من حذف المجموعة؟");

    if (!result) {
      return;
    }

    try {
      await api.delete(`/groups/${group.id}/delete`);
      setGroups((old) => old.filter((g) => g.id !== group.id));
      toast.success("تمت العملية بنجاح");
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error("لا تملك صلاحية");
      } else if (error?.response?.status === 404) {
        toast.error("المستخدم غير موجود");
      } else if (error?.response?.status >= 500) {
        toast.error("حدث خطأ داخلي");
      }
    }
  };

  return (
    <div className="flex flex-col mx-2 lg:mx-20 xl:mx-40 mt-6 ring-2 ring-[#ecebeb] rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-center">
              <thead className="border-b bg-[#f9fafb]">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-dark px-6 py-4"
                  >
                    اسم المجموعة
                  </th>

                  <th
                    scope="col"
                    className="text-sm font-medium text-dark px-6 py-4"
                  >
                    المستخدمين
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-dark px-6 py-4"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {groups?.map((group) => (
                  <tr
                    key={group.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="cursor-pointer px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {group?.name}
                    </td>

                    <td className="cursor-pointer text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {/* {order?.status === 0 ? (
                            <span className="flex items-center justify-center space-x-2">
                              <MdOutlinePendingActions /> <span>Pending</span>
                            </span>
                          ) : order?.status === 1 ? (
                            <span className="flex items-center justify-center space-x-2">
                              <MdOutlineLocalShipping />
                              <span>Shipped</span>
                            </span>
                          ) : (
                            <span className="flex items-center justify-center space-x-2">
                              <MdOutlineDone />
                              <span>Delivered</span>
                            </span>
                          )} */}
                      <button
                        onClick={() => handleUsersOpen(group)}
                        className="px-4 py-2 rounded-md bg-primary/10 text-primary"
                      >
                        عرض
                      </button>
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap flex items-center justify-start">
                      <MdEdit
                        onClick={() => handleEdit(group)}
                        className="text-info text-2xl mx-3 cursor-pointer"
                      />
                      <MdDelete
                        onClick={() => handleDelete(group)}
                        className="text-danger text-2xl mx-3 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsTable;
