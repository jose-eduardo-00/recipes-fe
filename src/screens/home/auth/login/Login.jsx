import React, { useState } from "react";
import MainInput from "../../../../components/inputs/mainInput";
import MainButton from "../../../../components/buttons/mainButton";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleRegister = () => {
    navigate("/Register");
  };

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/bgLogin.png')" }}
    >
      {/* Camada semi-transparente */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Conteúdo do card */}
      <div className="relative flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-md">
          <h2 className="text-xl font-bold text-center">Login</h2>

          <MainInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type={"email"}
            placeholder={"Email"}
            classInput={"w-11/12 h-10"}
            classDiv={"w-full mt-6 flex items-center"}
            classLabel={"w-11/12"}
            label={"Email"}
            id={"email"}
          />

          <MainInput
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type={"password"}
            placeholder={"*********"}
            classInput={"w-11/12 h-10"}
            classDiv={"w-full mt-6 flex items-center"}
            classLabel={"w-11/12"}
            label={"Senha"}
            id={"password"}
          />

          <p
            className="w-full text-center mt-6 cursor-pointer text-red-500 font-bold text-sm"
            onClick={handleRegister}
          >
            Ainda não possui uma conta?
          </p>

          <MainButton
            classButton={
              "w-11/12 h-12 bg-stone-950 hover:bg-stone-800 disabled:bg-stone-800 text-white"
            }
            classDiv={"mt-8"}
            classSpinner={"border-white"}
            isLoading={isLoading}
            onClick={handleLogin}
            text={"Continuar"}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
