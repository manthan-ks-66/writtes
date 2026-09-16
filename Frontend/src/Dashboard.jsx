import { Outlet } from "react-router-dom";
import NavBar from "./components/Header/NavBar.jsx";
import AppFooter from "./components/Footer/Footer.jsx";

function Dashboard() {
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

export default Dashboard;
