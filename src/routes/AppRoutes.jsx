import { Routes, Route } from "react-router-dom";
import Home from "../screens/home/Home/";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
