import { MdAdd, MdSearch } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import UsersTable from "../components/UsersTable";
import SearchInput from "../components/SearchInput";
import { useEffect, useState } from "react";
import UserAdd from "../components/Modals/UserAdd";
import api from "../api/api";
import UserUpdate from "../components/Modals/UserUpdate";
import UserGroups from "../components/Modals/UserGroups";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const navigate = useNavigate();

  const getUsers = async () => {
    const res = await api.get(`/users?search=${searchText}`);
    setUsers(res.data);
    console.log("====================================");
    console.log(res.data);
    console.log("====================================");
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      getUsers();
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="w-full overflow-auto pb-32">
      <div className="flex flex-col lg:flex-row bg-white w-full px-3 xl:px-40 py-2 justify-between border-y-[0.1px] border-lightGray/50">
        <div className="flex space-x-2">
          <span className="flex items-center text-sm lg:text-base font-bold text-dark ml-7">
            المستخدمين
          </span>
          <SearchInput
            onKeyPress={handleKeyPress}
            onChange={setSearchText}
            placeholder={"بحث"}
            Icon={MdSearch}
            className={"lg:mt-2 w-36 lg:w-60"}
          />
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="transition mt-2 lg:mt-0 h-8 lg:h-11 text-xs lg:text-sm flex justify-center items-center px-3 py-1 lg:py-2 border-4 rounded-full border-primary text-primary hover:text-white hover:bg-primary w-44"
        >
          <MdAdd />
          إضافة مستخدم
        </button>
      </div>
      <UsersTable
        users={users}
        setUsers={setUsers}
        setSelectedUser={setSelectedUser}
        setIsUpdateOpen={setIsUpdateOpen}
        setIsGroupsOpen={setIsGroupsOpen}
      />
      <UserAdd
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        setUsers={setUsers}
      />
      <UserUpdate
        user={selectedUser}
        isOpen={isUpdateOpen}
        setIsOpen={setIsUpdateOpen}
        setUsers={setUsers}
      />
      <UserGroups
        user={selectedUser}
        isOpen={isGroupsOpen}
        setIsOpen={setIsGroupsOpen}
      />
    </div>
  );
};

export default Users;
