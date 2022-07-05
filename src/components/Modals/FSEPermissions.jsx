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
import AppPermissionSwitch from "../AppPermissionSwitch";
import AppSelect from "../AppSelect";

const validationSchema = Yup.object().shape({
  // name: Yup.string().required("لا يمكن أن يكون حقل الاسم فارغ"),
});

const FSEPermissions = ({ isOpen, setIsOpen, selectedFile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [groups, setGroups] = useState([]);

  const [availableGroups, setAvailableGroups] = useState([]);
  const [newGroups, setNewGroups] = useState([]);
  const [updatedGroups, setUpdatedGroups] = useState([]);
  const [deletedGroups, setDeletedGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState({ id: 0, name: "---" });

  const getGroups = async () => {
    if (selectedFile === 0) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.get(`/documents/${selectedFile}/get-groups`);
      setGroups(res.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableGroups = async () => {
    if (selectedFile === 0) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.get(`/documents/${selectedFile}/linkable-groups`);
      setAvailableGroups(res.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGroups();
    getAvailableGroups();
    setNewGroups([]);
    setUpdatedGroups([]);
    setDeletedGroups([]);
    setSelectedGroup({ id: 0, name: "---" });
  }, [isOpen]);

  const handleAddGroup = () => {
    setNewGroups((old) => [
      {
        group_id: selectedGroup?.id,
        name: selectedGroup?.name,
        read: false,
        upload: false,
        download: false,
        delete: false,
      },
      ...old,
    ]);
    setAvailableGroups((old) => old.filter((o) => o.id !== selectedGroup?.id));
    setSelectedGroup({ id: 0, name: "---" });
  };

  const handleNewPermissionsChange = (group_id, permission, value) => {
    setNewGroups((old) =>
      old.map((o) => {
        if (o.group_id === group_id) {
          o[permission] = value;
        }
        return o;
      })
    );
  };

  const handlePermissionChange = (group_id, permission, value) => {
    setGroups((old) =>
      old.map((o) => {
        if (o.id === group_id) {
          o.pivot[permission] = value;
        }
        return o;
      })
    );
    let exists = false;
    updatedGroups.map((g) => {
      if (g === group_id) {
        exists = true;
      }
    });

    if (!exists) {
      setUpdatedGroups((old) => [...old, group_id]);
    }
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      let updated_groups = [];
      updatedGroups.map((g) => {
        let ug = groups.find((e) => e.id === g);
        updated_groups.push({
          group_id: g,
          read: ug?.pivot?.read,
          upload: ug?.pivot?.upload,
          download: ug?.pivot?.download,
          delete: ug?.pivot?.delete,
        });
      });

      await api.post(
        `/documents/${selectedFile}/manipulate-groups-and-permissions`,
        {
          updated_groups: JSON.stringify(updated_groups),
          new_groups: JSON.stringify(newGroups),
          deleted_groups: JSON.stringify(deletedGroups),
        }
      );
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

  const handleRemoveNew = (group) => {
    setNewGroups((old) => old.filter((o) => o.group_id !== group?.group_id));
    setAvailableGroups((old) => [
      { id: group?.group_id, name: group?.name },
      ...old,
    ]);
  };

  const handleRemoveOld = (group) => {
    setDeletedGroups((old) => [...old, group?.id]);
    setGroups((old) => old.filter((o) => o.id !== group?.id));
    setAvailableGroups((old) => [group, ...old]);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"صلاحيات الملف"}>
      {/* <span className="text-lg w-full">{file?.name}</span> */}
      <div className="flex items-center justify-between gap-x-2 w-full">
        <AppSelect
          value={selectedGroup}
          label={"اختر مجموعة"}
          handleChange={(value) => setSelectedGroup(value)}
          options={availableGroups}
          className={"flex-1"}
        />
        <button
          onClick={handleAddGroup}
          disabled={selectedGroup.id === 0}
          className={`rounded-full transition duration-100 w-20 h-8 lg:h-11 mt-10 mb-1 bg-inherit border-4 text-primary hover:bg-primary hover:text-white text-xs lg:text-sm border-primary`}
        >
          إضافة
        </button>
      </div>
      <div className="flex  flex-col py-5 space-y-3 max-h-[50vh] overflow-y-auto">
        {/* new groups */}
        {newGroups?.map((g) => (
          <div
            key={g?.group_id}
            className="flex flex-col justify-center rounded-md bg-success/10 px-2 py-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-900 text-sm py-1">{g?.name}</span>
              <MdDelete
                className="text-danger text-lg cursor-pointer"
                onClick={() => handleRemoveNew(g)}
              />
            </div>
            <div className="flex justify-between w-full">
              <div className="flex flex-col items-center text-dark text-sm">
                <span>قراءة</span>
                <AppPermissionSwitch
                  group={g?.group_id}
                  value={g?.read}
                  permission={"read"}
                  handleChange={handleNewPermissionsChange}
                />
              </div>
              <div className="flex flex-col items-center text-dark text-sm">
                <span>تحميل</span>
                <AppPermissionSwitch
                  group={g?.group_id}
                  value={g?.download}
                  permission={"download"}
                  handleChange={handleNewPermissionsChange}
                />
              </div>
              <div className="flex flex-col items-center text-dark text-sm">
                <span>حذف</span>
                <AppPermissionSwitch
                  group={g?.group_id}
                  value={g?.delete}
                  permission={"delete"}
                  handleChange={handleNewPermissionsChange}
                />
              </div>
              <div className="flex flex-col items-center text-dark text-sm">
                <span>رفع</span>
                <AppPermissionSwitch
                  group={g?.group_id}
                  value={g?.upload}
                  permission={"upload"}
                  handleChange={handleNewPermissionsChange}
                />
              </div>
            </div>
          </div>
        ))}
        {/* old groups */}
        {groups?.map((g) => (
          <div
            key={g?.id}
            className="flex flex-col justify-center rounded-md bg-primary/10 px-2 py-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-900 text-sm py-1">{g?.name}</span>
              <MdDelete
                className="text-danger text-lg cursor-pointer"
                onClick={() => handleRemoveOld(g)}
              />
            </div>
            <div className="flex justify-between w-full">
              <div className="flex flex-col items-center text-dark text-sm">
                <span>قراءة</span>
                <AppPermissionSwitch
                  group={g?.id}
                  value={g?.pivot?.read}
                  permission={"read"}
                  handleChange={handlePermissionChange}
                />
              </div>
              <div className="flex flex-col items-center text-dark text-sm">
                <span>تحميل</span>
                <AppPermissionSwitch
                  group={g?.id}
                  value={g?.pivot?.download}
                  permission={"download"}
                  handleChange={handlePermissionChange}
                />
              </div>
              <div className="flex flex-col items-center text-dark text-sm">
                <span>حذف</span>
                <AppPermissionSwitch
                  group={g?.id}
                  value={g?.pivot?.delete}
                  permission={"delete"}
                  handleChange={handlePermissionChange}
                />
              </div>
              <div className="flex flex-col items-center text-dark text-sm">
                <span>رفع</span>
                <AppPermissionSwitch
                  group={g?.id}
                  value={g?.pivot?.upload}
                  permission={"upload"}
                  handleChange={handlePermissionChange}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-10 justify-between">
        <AppButton
          type="button"
          onClick={() => setIsOpen(false)}
          className={"border-dark text-dark hover:bg-dark hover:text-white"}
        >
          إلغاء
        </AppButton>
        <AppButton isLoading={isUpdating} onClick={() => handleSave()}>
          حفظ
        </AppButton>
      </div>
    </AppModal>
  );
};

export default FSEPermissions;
