import { Outlet } from "react-router-dom";
import NavBar from "./components/Header/NavBar";
import AppFooter from "./components/Footer/Footer.jsx";

function DashBoard() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <AppFooter />
    </>
  );
}

export default DashBoard;
