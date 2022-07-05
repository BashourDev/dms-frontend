import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/userContext";
import AppButton from "../AppButton";
import AppModal from "./AppModal";
import api from "../../api/api";
import moment from "../../myMoment";
import { toast } from "react-toastify";
import Loading from "../Loading";
import FileAdd from "./FileAdd";
import FileEdit from "./FileEdit";
import FileVersions from "./FileVersions";
import FolderAdd from "./FolderAdd";
import FolderEdit from "./FolderEdit";
import FSEPermissions from "./FSEPermissions";
import AppReminderFile from "../AppReminderFile";

const Reminder = ({ isOpen, setIsOpen, setReminderCount }) => {
  const [archive, setArchive] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileEditOpen, setIsFileEditOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(0);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedFSEPermissions, setSelectedFSEPermissions] = useState({});
  const userContext = useContext(UserContext);

  const getReminder = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/users/my-reminders`);
      setArchive(res.data.documents);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReminder();
  }, [isOpen]);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={"المذكرة"}>
      <div className="flex flex-col py-5 space-y-3 max-h-[60vh] overflow-y-auto">
        <div className="w-full overflow-y-auto pb-20">
          <div className="flex flex-col justify-center sm:justify-start w-full gap-y-7 py-5">
            {isLoading ? (
              <Loading />
            ) : !archive.length ? (
              <span className="w-full text-center text-dark">
                المذكرة فارغة
              </span>
            ) : (
              archive.map((ar) => (
                <div key={ar.id} className="flex flex-col">
                  <AppReminderFile
                    id={ar.id}
                    name={ar.name}
                    dueDate={ar.due_date}
                    setFSEs={setArchive}
                    setSelectedFile={setSelectedFile}
                    setIsEditOpen={setIsFileEditOpen}
                    setIsVersionsOpen={setIsVersionsOpen}
                    setIsPermissionsOpen={setIsPermissionsOpen}
                    media={ar?.media}
                    permissions={
                      !userContext?.user?.is_admin ? ar?.permissions[0] : {}
                    }
                    setSelectedFilePermissions={setSelectedFSEPermissions}
                    setReminderCount={setReminderCount}
                  />
                  <div className="w-full h-0.5 my-1 bg-lightGray/50" />
                </div>
              ))
            )}
          </div>

          <FileEdit
            isOpen={isFileEditOpen}
            setIsOpen={setIsFileEditOpen}
            setFSEs={setArchive}
            selectedFile={selectedFile}
          />
          <FileVersions
            isOpen={isVersionsOpen}
            setIsOpen={setIsVersionsOpen}
            selectedFile={selectedFile}
            permissions={selectedFSEPermissions}
          />

          <FSEPermissions
            isOpen={isPermissionsOpen}
            setIsOpen={setIsPermissionsOpen}
            selectedFile={selectedFile}
          />
        </div>
      </div>
      <AppButton
        type="button"
        onClick={() => setIsOpen(false)}
        className={"border-dark text-dark hover:bg-dark hover:text-white"}
      >
        إغلاق
      </AppButton>
    </AppModal>
  );
};

export default Reminder;
