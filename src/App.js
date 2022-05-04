import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import api from "./api/api";
import { getUser } from "./api/user";
import SetupInterceptors from "./api/SetupInterceptors";
import UserContext from "./contexts/userContext";
import WindowContext from "./contexts/windowContext";
import Users from "./pages/Users";
import Groups from "./pages/Groups";
import Archive from "./pages/Archive";

function NavigateFunctionComponent(props) {
  let navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
    if (api.interceptors.response.handlers.length === 0) {
      SetupInterceptors(navigate, location);
    }
  }, []);
  return <></>;
}

function App() {
  const [user, setUser] = useState(() => {
    if (!getUser()) {
      return {};
    }

    return getUser();
  });

  const [windowWidth, setWindowWidth] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      navigate("/login");
      return;
    }
  }, [user]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  return (
    <div className="overflow-y-hidden font-droid-kufi">
      <NavigateFunctionComponent />
      <WindowContext.Provider value={{ width: windowWidth }}>
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
          <ToastContainer className={"z-50"} rtl autoClose={3000} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="archive" element={<Archive />} />
              <Route path="groups" element={<Groups />} />
              <Route path="users" element={<Users />} />
            </Route>
            <Route
              path="*"
              element={<Navigate to={"/dashboard/archive"} replace />}
            />
          </Routes>
        </UserContext.Provider>
      </WindowContext.Provider>
    </div>
  );
}

export default App;
