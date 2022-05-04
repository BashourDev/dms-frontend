import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { HiDocumentText } from "react-icons/hi";
import { AiOutlineMenu } from "react-icons/ai";
import { MdGroup, MdPerson } from "react-icons/md";
import AppButton from "../components/AppButton";
import api from "../api/api";
import { removeUser } from "../api/user";
import { removeToken } from "../api/token";
import UserContext from "../contexts/userContext";
import WindowContext from "../contexts/windowContext";
import Loading from "../components/Loading";
import MyAccount from "../components/Modals/MyAccount";
import logo from "../assets/logo.png";
import Categories from "../components/Modals/Categories";

const Dashboard = () => {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const userContext = useContext(UserContext);
  const windowContext = useContext(WindowContext);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    try {
      await api.get("/logout");
      removeUser();
      removeToken();
      userContext.setUser({});
      navigate("/login");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const checkActiveItem = (items) => {
    if (activeItem === items) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (location.pathname.match("/dashboard/archive")) {
      setActiveItem("archive");
    } else if (location.pathname.match("/dashboard/groups")) {
      setActiveItem("groups");
    } else if (location.pathname.match("/dashboard/users")) {
      setActiveItem("users");
    }
  }, [location]);

  return (
    <div dir="rtl" className="flex flex-col h-screen bg-light">
      <div className="px-6 bg-sky-700 shadow-md flex flex-col lg:flex-row items-center justify-between">
        <div className="flex gap-3 lg:gap-5 py-2 lg:py-4">
          <img src={logo} alt="logo" className="text-light w-8 h-8" />
          <h1 className="text-base lg:text-lg text-light font-semibold">
            أرشيف جامعة الحواش الخاصة
          </h1>
          <button
            onClick={() => setIsCatOpen(true)}
            disabled={loading}
            className={
              "border-light mt-0 mb-0 mx-4 text-light disabled:text-light disabled:bg-lightGray disabled:hover:bg-light disabled:hover:text-lightGray"
            }
          >
            {"التصنيفات"}
          </button>
          {/* {userContext.user.role !== 0 && (
            <div className="flex">
              <BsChevronCompactLeft className="text-light w-6 h-8" />
              <span className="text-base lg:text-lg text-light font-medium ">
                {userContext?.user?.hospital?.name}
              </span>
            </div>
          )} */}
        </div>
        <div className="flex items-center mb-2 lg:mb-0">
          <AppButton
            onClick={() => setIsOpen(true)}
            disabled={loading}
            className={
              "border-light mt-0 mb-0 mx-1 text-light bg-sky-700 hover:bg-light hover:text-sky-700 disabled:text-light disabled:bg-lightGray disabled:hover:bg-light disabled:hover:text-lightGray w-28 lg:w-36 border-4"
            }
          >
            {"حسابي"}
          </AppButton>
          <AppButton
            onClick={() => logout()}
            disabled={loading}
            className={
              "border-light mt-0 mb-0 mx-1 text-light bg-sky-700 hover:bg-light hover:text-sky-700 disabled:text-light disabled:bg-lightGray disabled:hover:bg-light disabled:hover:text-lightGray w-28 lg:w-36 border-4"
            }
          >
            {loading ? <Loading className="w-8 h-8" /> : "تسجيل الخروج"}
          </AppButton>
        </div>
      </div>
      <div className="flex h-full z-10">
        {userContext?.user?.is_admin ? (
          <ProSidebar
            rtl
            collapsed={sideBarCollapsed}
            collapsedWidth={windowContext.width > 710 ? 80 : 70}
            className="hidden md:block"
          >
            <Menu iconShape="circle">
              <MenuItem
                icon={<AiOutlineMenu />}
                onClick={() => setSideBarCollapsed(!sideBarCollapsed)}
              ></MenuItem>
              <MenuItem
                className={`${
                  checkActiveItem("archive") ? "bg-slate-800" : ""
                }`}
                icon={<HiDocumentText />}
              >
                <NavLink to={"/dashboard/archive"}>الأرشيف</NavLink>
              </MenuItem>

              <MenuItem
                className={`${checkActiveItem("groups") ? "bg-slate-800" : ""}`}
                icon={<MdGroup />}
              >
                <NavLink to={"/dashboard/groups"}>المجموعات</NavLink>
              </MenuItem>
              <MenuItem
                className={`${checkActiveItem("users") ? "bg-slate-800" : ""}`}
                icon={<MdPerson />}
              >
                <NavLink to={"/dashboard/users"}>المستخدمين</NavLink>
              </MenuItem>
            </Menu>
          </ProSidebar>
        ) : null}

        <Outlet />

        <div className="fixed bottom-0 z-20 md:hidden flex justify-around items-center w-full h-16 ring-inset ring-2 ring-lightGray/50 shadow-md bg-white">
          <div className="h-full">
            <NavLink
              className={({ isActive }) =>
                `flex flex-col justify-center items-center h-full transition ${
                  isActive
                    ? "text-primary border-t-2 border-t-primary"
                    : "text-dark"
                }`
              }
              to={"/dashboard/archive"}
            >
              <HiDocumentText className="text-lg" />
              <span className="text-xs">الأرشيف</span>
            </NavLink>
          </div>
          <div className="h-full">
            <NavLink
              className={({ isActive }) =>
                `flex flex-col justify-center items-center h-full transition ${
                  isActive
                    ? "text-primary border-t-2 border-t-primary"
                    : "text-dark"
                }`
              }
              to={"/dashboard/groups"}
            >
              <MdGroup className="text-lg" />
              <span className="text-xs">المجموعات</span>
            </NavLink>
          </div>
          <div className="h-full">
            <NavLink
              className={({ isActive }) =>
                `flex flex-col justify-center items-center h-full transition ${
                  isActive
                    ? "text-primary border-t-2 border-t-primary"
                    : "text-dark"
                }`
              }
              to={"/dashboard/users"}
            >
              <MdPerson className="text-lg" />
              <span className="text-xs">المستخدمين</span>
            </NavLink>
          </div>
        </div>
      </div>
      <MyAccount isOpen={isOpen} setIsOpen={setIsOpen} />
      <Categories isOpen={isCatOpen} setIsOpen={setIsCatOpen} />
    </div>
  );
};

export default Dashboard;
