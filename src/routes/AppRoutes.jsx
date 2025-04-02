import { Routes, Route } from "react-router-dom";
import Home from "../screens/home/Home";
import Register from "../screens/home/auth/register/Register";
import Login from "../screens/home/auth/login/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
