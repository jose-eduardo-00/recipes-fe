import { Routes, Route } from "react-router-dom";
import Home from "../screens/home/Home";
import Register from "../screens/auth/register/Register";
import Login from "../screens/auth/login/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
