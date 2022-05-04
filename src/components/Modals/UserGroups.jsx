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
import Loading from "../Loading";

const UserGroups = ({ user, isOpen, setIsOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [groups, setGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState({ id: 0, name: "---" });

  const getUserGroups = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/users/${user.id}/groups`);
      setGroups(res.data);
    } catch (error) {
      toast.error("حدث خطأ");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserAvailableGroups = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/users/${user.id}/groups/available`);
      setAvailableGroups(res.data);
      if (res.data.length > 0) {
        setSelectedGroup(res?.data[0]);
      }
    } catch (error) {
      toast.error("حدث خطأ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      getUserGroups();
      getUserAvailableGroups();
    }
  }, [isOpen]);

  const handleDelete = async (group) => {
    let result = await conf("هل أنت متأكد من إزالة المستخدم من المجموعة؟");

    if (!result) {
      return;
    }
    try {
      await api.delete(`/groups/${user.id}/groups/delete/${group.id}`);
      setGroups((old) => old.filter((o) => o.id !== group.id));
      setAvailableGroups((old) => [...old, group]);
      toast.success("تمت العملية بنجاح");
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleAdd = async () => {
    setIsUpdating(true);
    try {
      const res = await api.post(
        `/groups/${user.id}/groups/add/${selectedGroup?.id}`,
        {}
      );
      setGroups((old) => [...old, selectedGroup]);
      setAvailableGroups((old) => old.filter((o) => o.id !== selectedGroup.id));
      setSelectedGroup({ id: 0, username: "---" });
      toast.success("تمت العملية بنجاح");
    } catch (error) {
      toast.error("حدث خطأ");
    }
    setIsUpdating(false);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"مجموعات المستخدم"}>
      <div className="flex items-center justify-between gap-x-2 w-full">
        <AppSelect
          value={selectedGroup}
          label={"اختر مجموعة"}
          handleChange={(value) => setSelectedGroup(value)}
          options={availableGroups}
          className={"flex-1"}
        />
        <button
          onClick={handleAdd}
          disabled={selectedGroup.id === 0 || isLoading || isUpdating}
          className={`rounded-full transition duration-100 w-20 h-8 lg:h-11 mt-10 mb-1 bg-inherit border-4 text-primary hover:bg-primary hover:text-white text-xs lg:text-sm border-primary`}
        >
          {isUpdating ? <Loading className="w-8 h-8" /> : "إضافة"}
        </button>
      </div>
      <div className="flex flex-col w-full space-y-2 h-64 py-2">
        {isLoading ? (
          <Loading />
        ) : groups.length > 0 ? (
          groups.map((group) => (
            <div
              key={group?.id}
              className="flex justify-between items-center w-full px-3 py-4 shadow-lg ring-1 ring-lightGray/50 rounded-md"
            >
              <span>{group.name}</span>
              <MdDelete
                onClick={() => handleDelete(group)}
                className={"text-danger text-lg cursor-pointer"}
              />
            </div>
          ))
        ) : (
          <span className="text-lightGray text-sm self-center my-auto">
            لا يوجد مجموعات
          </span>
        )}
      </div>
    </AppModal>
  );
};

export default UserGroups;
