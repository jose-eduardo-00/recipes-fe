import React, { useState } from "react";
import MainInput from "../../../components/inputs/mainInput";
import MainButton from "../../../components/buttons/mainButton";
import { useNavigate } from "react-router-dom";
import MainAlert from "../../../components/alerts/mainAlert";
import api from "../../../services/api/auth/index";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [msgAlert, setMsgAlert] = useState(false);
  const [msgText, setMsgText] = useState(false);
  const [msgTitle, setMsgTitle] = useState(false);
  const [msgType, setMsgType] = useState(false);

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/home");
  };

  const handleLogin = () => {
    setIsLoading(true);

    if (email == "" || pass == "") {
      setIsLoading(false);

      setMsgType("warning");
      setMsgTitle("Aviso");
      setMsgText("Preencha todos os campos.");
      setMsgAlert(true);

      setTimeout(() => {
        setMsgAlert(false);
      }, 3000);
    } else {
      api.login(email, pass).then((res) => {
        console.log(res.status, res.data);
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);

          setMsgType("success");
          setMsgTitle("Sucesso");
          setMsgText("Login realizado com sucesso.");
          setMsgAlert(true);

          setTimeout(() => {
            handleHome();
            setIsLoading(false);
            setMsgAlert(false);
          }, 3000);
        } else if (res.status === 400) {
          setIsLoading(false);

          setMsgType("error");
          setMsgTitle("Erro");
          setMsgText("Esse email não possui uma conta.");
          setMsgAlert(true);

          setTimeout(() => {
            setMsgAlert(false);
          }, 3000);
        } else if (res.status === 401) {
          setIsLoading(false);

          setMsgType("error");
          setMsgTitle("Erro");
          setMsgText("Senha ou email incorretos.");
          setMsgAlert(true);

          setTimeout(() => {
            setMsgAlert(false);
          }, 3000);
        } else if (res.status === 403) {
          setIsLoading(false);

          setMsgType("error");
          setMsgTitle("Erro");
          setMsgText("Essa conta foi desativada ou banida.");
          setMsgAlert(true);

          setTimeout(() => {
            setMsgAlert(false);
          }, 3000);
        } else {
          setIsLoading(false);

          setMsgType("error");
          setMsgTitle("Erro");
          setMsgText("Erro de conexão, tente novamente mais tarde.");
          setMsgAlert(true);

          setTimeout(() => {
            setMsgAlert(false);
          }, 3000);
        }
      });
    }
  };

  const handleRegister = () => {
    navigate("/Register");
  };

  const handleForgotPass = () => {
    // qunado tiver a tela de recuperar senha
    // navigate("/");
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
          <h2 className="text-xl font-bold text-center mb-4">Login</h2>

          {msgAlert && (
            <MainAlert type={msgType} message={msgText} title={msgTitle} />
          )}

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
            classInput={"w-11/12 h-10 "}
            classDiv={"w-full mt-6 flex items-center"}
            classLabel={"w-11/12"}
            classIcon={"!right-4"}
            label={"Senha"}
            id={"password"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />

          <p
            className="w-full text-center mt-4 cursor-pointer text-red-500 font-bold text-xs"
            onClick={handleForgotPass}
          >
            Esqueceu sua senha?
          </p>

          <p
            className="w-full text-center mt-4 cursor-pointer text-red-500 font-bold text-sm"
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
