import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import UserContext from "../../contexts/userContext";
import AppButton from "../AppButton";
import AppModal from "./AppModal";
import AppForm from "../forms/components/AppForm";
import api from "../../api/api";
import AppInput from "../forms/components/AppFormInput";
import AppFormSwitch from "../forms/components/AppFormSwitch";
import AppSubmitButton from "../forms/components/AppSubmitButton";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import AppSelect from "../AppSelect";
import { conf } from "../appConfirm";
import AppUserSelect from "../AppUserSelect";
import Loading from "../Loading";

const GroupUsers = ({ group, isOpen, setIsOpen }) => {
  const [isLoading, setisLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [users, setUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({ id: 0, username: "---" });

  const getGroupUsers = async () => {
    try {
      setisLoading(true);
      const res = await api.get(`/groups/${group.id}/users`);
      setUsers(res.data);
    } catch (error) {
      toast.error("حدث خطأ");
    } finally {
      setisLoading(false);
    }
  };

  const getGroupAvailableUsers = async () => {
    try {
      setisLoading(true);
      const res = await api.get(`/groups/${group.id}/users/available`);
      setAvailableUsers(res.data);
      if (res.data.length > 0) {
        setSelectedUser(res?.data[0]);
      }
    } catch (error) {
      toast.error("حدث خطأ");
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (group.id) {
      getGroupUsers();
      getGroupAvailableUsers();
    }

    // return () => {
    //   setUsers([]);
    //   setAvailableUsers([]);
    // };
  }, [isOpen]);

  const handleDelete = async (user) => {
    let result = await conf("هل أنت متأكد من إزالة المستخدم من المجموعة؟");

    if (!result) {
      return;
    }
    try {
      await api.delete(`/groups/${user.id}/groups/delete/${group.id}`);
      setUsers((old) => old.filter((o) => o.id !== user.id));
      setAvailableUsers((old) => [...old, user]);
      toast.success("تمت العملية بنجاح");
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleAdd = async () => {
    setIsUpdating(true);
    try {
      await api.post(`/groups/${selectedUser.id}/groups/add/${group?.id}`, {});
      setUsers((old) => [...old, selectedUser]);
      setAvailableUsers((old) => old.filter((o) => o.id !== selectedUser.id));
      setSelectedUser({ id: 0, username: "---" });
      toast.success("تمت العملية بنجاح");
    } catch (error) {
      toast.error("حدث خطأ");
    } finally {
      setIsUpdating(false);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"مستخدمين المجموعة"}>
      <div className="flex items-center justify-between gap-x-2 w-full">
        <AppUserSelect
          value={selectedUser}
          label={"اختر مستخدم"}
          handleChange={(value) => setSelectedUser(value)}
          options={availableUsers}
          className={"flex-1"}
        />
        <button
          onClick={handleAdd}
          disabled={selectedUser.id === 0}
          className={`rounded-full transition duration-100 w-20 h-8 lg:h-11 mt-10 mb-1 bg-inherit border-4 text-primary hover:bg-primary hover:text-white text-xs lg:text-sm border-primary`}
        >
          {isUpdating ? <Loading className="w-8 h-8" /> : "إضافة"}
        </button>
      </div>
      <div className="flex flex-col w-full space-y-2 h-64 py-2">
        {isLoading ? (
          <Loading />
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user?.id}
              className="flex justify-between items-center w-full px-3 py-4 shadow-lg ring-1 ring-lightGray/50 rounded-md"
            >
              <span>{user.username}</span>
              <MdDelete
                onClick={() => handleDelete(user)}
                className={"text-danger text-lg cursor-pointer"}
              />
            </div>
          ))
        ) : (
          <span className="text-lightGray text-sm self-center my-auto">
            لا يوجد مستخدمين
          </span>
        )}
      </div>
    </AppModal>
  );
};

export default GroupUsers;
