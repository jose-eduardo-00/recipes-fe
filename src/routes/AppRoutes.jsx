import { Routes, Route } from "react-router-dom";
import Home from "../screens/home/Home";
import Register from "../screens/auth/register/Register";
import Login from "../screens/auth/login/Login";
import NewRecipes from "../screens/newRecipes/NewRecipes";
import Layout from "../components/layout/Layout";
import Category from "../screens/category/Category";
import UsersList from "../screens/usersList/UsersList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/new-recipes"
        element={
          <Layout>
            <NewRecipes />
          </Layout>
        }
      />
      <Route
        path="/category"
        element={
          <Layout>
            <Category />
          </Layout>
        }
      />
      <Route
        path="/users-list"
        element={
          <Layout>
            <UsersList />
          </Layout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
