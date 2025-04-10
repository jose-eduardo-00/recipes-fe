// components/navbar/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api/auth/index";
import MainButton from "../buttons/mainButton";
import MainAlert from "../alerts/mainAlert";

const Navbar = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [msgAlert, setMsgAlert] = useState(false);
  const [msgText, setMsgText] = useState(false);
  const [msgTitle, setMsgTitle] = useState(false);
  const [msgType, setMsgType] = useState(false);

  const navigate = useNavigate();

  const hasFetched = useRef(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogin = () => {
    navigate("/");
  };

  const handleCheckToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      api.checkToken(token).then((res) => {
        if (res.status !== 200) {
          handleLogin();
        } else {
          const decoded = jwtDecode(token);
          setUser(decoded);
          setToken(token);
        }
      });
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      handleCheckToken();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoading(true);

    api.logout(token).then((res) => {
      if (res.status === 200 || res.status === 400) {
        localStorage.removeItem("token");

        setIsLoading(false);
        handleLogin();
      } else {
        setIsLoading(false);

        setMsgType("error");
        setMsgTitle("Erro");
        setMsgText(
          "Ocorreu um erro ao tentar sair, tente novamente mais tarde."
        );
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      }
    });
  };

  return (
    <nav className="w-full h-20 bg-white px-4 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.1)] z-10">
      <button
        onClick={toggleSidebar}
        className="text-gray-700 text-xl cursor-pointer ms-6"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      <div className="me-6 flex flex-row items-center gap-4">
        <h2 className="font-medium">
          {user != null ? `${user.firstName} ${user.lastName}` : ""}
        </h2>
        <button
          ref={buttonRef}
          className=" cursor-pointer flex flex-row items-center gap-2"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <div className="w-10 h-10 rounded-4xl bg-gray-300 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <FontAwesomeIcon icon={faAngleDown} />
        </button>

        <div
          ref={dropdownRef}
          className={`absolute right-5 top-15 mt-2 w-64 bg-white rounded-md p-4 z-50 transition-all duration-300 ease-in-out transform shadow-[0_4px_12px_rgba(0,0,0,0.2)]
            ${
              isDropdownOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-6 pointer-events-none"
            }
          `}
        >
          {user ? (
            <>
              {msgAlert && (
                <MainAlert type={msgType} message={msgText} title={msgTitle} />
              )}
              <ul className="space-y-6 mb-4 mt-2">
                <li className="shadow-[0_2px_4px_rgba(0,0,0,0.1)] z-10 w-full flex items-center justify-center pb-2">
                  <Link
                    to="/perfil"
                    className="group inline-flex items-center gap-2 relative w-fit"
                  >
                    <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                    <span className="font-bold">Perfil</span>
                    <span className="absolute left-[-4px] -bottom-1 h-[3px] w-[calc(100%+8px)] bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded" />
                  </Link>
                </li>
              </ul>

              <MainButton
                classButton={"bg-black w-full text-white !py-2.5"}
                onClick={handleLogout}
                isLoading={isLoading}
                text={"Sair"}
              />
            </>
          ) : (
            <p className="text-sm text-gray-500">Carregando...</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
