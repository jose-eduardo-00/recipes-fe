// components/sidebar/Sidebar.jsx
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderClosed,
  faHouse,
  faLayerGroup,
  faNewspaper,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api/auth/index";
import { jwtDecode } from "jwt-decode";
import { useGlobalContext } from "../../context/context";

const Sidebar = ({ isOpen }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { token } = useGlobalContext();

  const handleLogin = () => {
    navigate("/");
  };

  const handleCheckToken = () => {
    if (token) {
      api.checkToken(token).then((res) => {
        if (res.status !== 200) {
          handleLogin();
        } else {
          const decoded = jwtDecode(token);
          setUser(decoded);
        }
      });
    }
  };

  useEffect(() => {
    if (token) {
      handleCheckToken();
    }
  }, [token]);

  return (
    <div className="flex">
      <aside
        className={`${
          isOpen ? "w-64 p-4" : "w-0 py-4"
        } min-h-screen bg-gray-800 text-white transition-all duration-500 overflow-hidden`}
      >
        {user?.role === "admin" && (
          <div className="border-b-1 mb-8">
            <h2
              className={`text-xl font-bold mb-4 pb-4 flex justify-center border-b transition-opacity duration-500 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Administrador
            </h2>
            <ul className="space-y-6 ps-2 mb-6">
              <li
                className={`transition-opacity duration-500 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                <Link
                  to="/users-list"
                  className="group inline-flex items-center gap-2 relative w-fit"
                >
                  <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
                  <span className="font-bold">Usuários</span>
                  <span className="absolute left-[-4px] -bottom-1 h-[3px] w-[calc(100%+8px)] bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded" />
                </Link>
              </li>
              <li
                className={`transition-opacity duration-500 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                <Link
                  to="/category"
                  className="group inline-flex items-center gap-2 relative w-fit"
                >
                  <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5" />
                  <span className="font-bold">Categorias</span>
                  <span className="absolute left-[-4px] -bottom-1 h-[3px] w-[calc(100%+8px)] bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded" />
                </Link>
              </li>
            </ul>
          </div>
        )}

        <h2
          className={`text-xl font-bold mb-4 pb-4 flex justify-center border-b transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          Receitas
        </h2>
        <ul className="space-y-6 ps-2">
          <li
            className={`transition-opacity duration-500 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link
              to="/home"
              className="group inline-flex items-center gap-2 relative w-fit"
            >
              <FontAwesomeIcon icon={faHouse} className="w-5 h-5" />
              <span className="font-bold">Home</span>
              <span className="absolute left-[-4px] -bottom-1 h-[3px] w-[calc(100%+12px)] bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded" />
            </Link>
          </li>
          <li
            className={`transition-opacity duration-500 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link
              to="/new-recipes"
              className="group inline-flex items-center gap-2 relative w-fit"
            >
              <FontAwesomeIcon icon={faNewspaper} className="w-5 h-5" />
              <span className="font-bold whitespace-nowrap">
                Criar Receitas
              </span>
              <span className="absolute left-[-4px] -bottom-1 h-[3px] w-[calc(100%+12px)] bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded" />
            </Link>
          </li>
          <li
            className={`transition-opacity duration-500 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link
              to="/my-recipes"
              className="group inline-flex items-center gap-2 relative w-fit"
            >
              <FontAwesomeIcon icon={faFolderClosed} className="w-5 h-5" />
              <span className="font-bold whitespace-nowrap">
                Minhas Receitas
              </span>
              <span className="absolute left-[-4px] -bottom-1 h-[3px] w-[calc(100%+12px)] bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded" />
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
