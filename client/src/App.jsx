import { Outlet } from "react-router-dom";
import AntdSpin from "./components/AntdSpin.jsx";

// methods and services
import { useEffect, useState } from "react";
import authService from "./services/authService.js";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice.js";

function App() {
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((user) => {
        if (user) dispatch(login(user));
      })
      .catch(() => {
        dispatch(logout());
      })
      .finally(() => setLoader(false));
  }, [dispatch]);

  return !loader ? <Outlet /> : <AntdSpin />;
}

export default App;
