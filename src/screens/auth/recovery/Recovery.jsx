import React, { useState } from "react";
import MainInput from "../../../components/inputs/mainInput";
import MainButton from "../../../components/buttons/mainButton";
import MainAlert from "../../../components/alerts/mainAlert";
import api from "../../../services/api/auth/index";
import { useNavigate } from "react-router-dom";

const Recovery = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");

  const [senhaOff, setSenhaOff] = useState(true);
  const [passValid, setPassValid] = useState(false);
  const [passInvalid, setPassInvalid] = useState(false);

  const [confPassValid, setConfPassValid] = useState(false);
  const [confPassInvalid, setConfPassInvalid] = useState(false);

  const [msgAlert, setMsgAlert] = useState(false);
  const [msgText, setMsgText] = useState(false);
  const [msgTitle, setMsgTitle] = useState(false);
  const [msgType, setMsgType] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const handleNextStep = () => {
    setIsLoading(true);
    if (step == 1) {
      if (email != "") {
        api.sendEmail(email).then((res) => {
          if (res.status === 200) {
            setUser(res.data.user);
            setMsgType("success");
            setMsgTitle("Sucesso");
            setMsgText("Email encontrado.");
            setMsgAlert(true);

            setTimeout(() => {
              setIsLoading(false);
              setStep(2);
              setMsgAlert(false);
            }, 2000);
          } else {
            setMsgType("error");
            setMsgTitle("Erro");
            setMsgText("Email não encontrado na base de dados.");
            setIsLoading(false);
            setMsgAlert(true);

            setTimeout(() => {
              setMsgAlert(false);
            }, 3000);
          }
        });
      } else {
        setMsgType("warning");
        setMsgTitle("Aviso");
        setMsgText("Preencha o campo de email.");
        setIsLoading(false);
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      }
    } else if (step == 2) {
      if (pass == "" || confPass == "") {
        setMsgType("warning");
        setMsgTitle("Aviso");
        setMsgText("Preencha os todos os campos.");
        setIsLoading(false);
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      } else if (pass != confPass) {
        setMsgType("warning");
        setMsgTitle("Aviso");
        setMsgText(
          "O campo de confirmar senha precisa ser igual ao campo de senha."
        );
        setIsLoading(false);
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      } else if (confPassValid) {
        api.changePass(user.id, pass).then((res) => {
          if (res.status === 200) {
            setMsgType("success");
            setMsgTitle("Sucesso");
            setMsgText("Senha atualizada com sucesso.");
            setMsgAlert(true);

            setTimeout(() => {
              setIsLoading(false);
              setMsgAlert(false);
              navigate("/");
            }, 3000);
          } else {
            setMsgType("error");
            setMsgTitle("Erro");
            setMsgText(
              "Falha ao tentar trocar a senha, tente novamente mais tarde."
            );
            setIsLoading(false);
            setMsgAlert(true);

            setTimeout(() => {
              setMsgAlert(false);
            }, 3000);
          }
        });
      } else {
        setMsgType("error");
        setMsgTitle("Erro");
        setMsgText("Senha inválida, preencha corretamente o campo de senha.");
        setIsLoading(false);
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      }
    }
  };

  const handlePass = (event) => {
    const value = event.target.value;

    const senhaValida =
      value.length >= 8 &&
      /[A-Za-z]/.test(value) && // tem letra
      /[0-9]/.test(value) && // tem número
      /[^A-Za-z0-9]/.test(value); // tem símbolo

    setPass(value); // Sempre atualiza o valor digitado

    if (value.length == 0) {
      setSenhaOff(true);
      setPassValid(false);
      setPassInvalid(false);
    } else if (senhaValida) {
      setPassValid(true);
      setPassInvalid(false);
      setSenhaOff(false);
    } else {
      setSenhaOff(true);
      setPassValid(false);
      setPassInvalid(true);
    }

    if (value.length == 0 && confPass.length == 0) {
      setConfPassValid(false);
      setConfPassInvalid(false);
    } else if (value == confPass) {
      setConfPassValid(true);
      setConfPassInvalid(false);
    } else {
      setConfPassValid(false);
      setConfPassInvalid(true);
    }
  };

  const handleConfPass = (event) => {
    const value = event.target.value;

    setConfPass(value); // Sempre atualiza o valor digitado

    if (value.length == 0) {
      setConfPassValid(false);
      setConfPassInvalid(false);
    } else if (value == pass) {
      setConfPassValid(true);
      setConfPassInvalid(false);
    } else {
      setConfPassValid(false);
      setConfPassInvalid(true);
    }
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
          <h2 className="text-xl font-bold text-center mb-4">
            Recuperar Senha
          </h2>

          {msgAlert && (
            <MainAlert type={msgType} message={msgText} title={msgTitle} />
          )}
          {step == 1 && (
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNextStep();
                }
              }}
            />
          )}

          {step == 2 && (
            <div>
              <MainInput
                value={pass}
                onChange={handlePass}
                type={"password"}
                placeholder={"*********"}
                classInput={`w-11/12 h-10 focus:outline-none ${
                  passValid
                    ? "!border-green-400 focus:!border-green-400"
                    : passInvalid
                    ? "!border-red-400 focus:!border-red-400"
                    : ""
                }`}
                classDiv={"w-full mt-6 flex items-center"}
                classLabel={"w-11/12"}
                classIcon={"!right-4"}
                label={"Senha"}
                id={"senha"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNextStep();
                  }
                }}
              />
              <MainInput
                value={confPass}
                onChange={handleConfPass}
                type={"password"}
                placeholder={"*********"}
                classInput={`w-11/12 h-10 focus:outline-none ${
                  confPassValid
                    ? "!border-green-400 focus:!border-green-400"
                    : confPassInvalid
                    ? "!border-red-400 focus:!border-red-400"
                    : ""
                }`}
                classDiv={"w-full mt-6 flex items-center"}
                classLabel={"w-11/12"}
                classIcon={"!right-4"}
                label={"Confirmar Senha"}
                id={"confimrarSenha"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNextStep();
                  }
                }}
              />

              {senhaOff && (
                <p className="w-11/12 text-xs mt-2 justify-self-center text-red-500">
                  A senha precisa ter pelo menos 8 dígitos e ter: número, letra
                  e símbolo.
                </p>
              )}
            </div>
          )}

          <MainButton
            classButton={
              "w-11/12 h-12 bg-stone-950 hover:bg-stone-800 disabled:bg-stone-800 text-white"
            }
            classDiv={"mt-10"}
            classSpinner={"border-white"}
            isLoading={isLoading}
            onClick={handleNextStep}
            text={"Continuar"}
          />
        </div>
      </div>
    </div>
  );
};

export default Recovery;
