import React, { useState } from "react";
import MainInput from "../../../../components/inputs/mainInput";
import MainButton from "../../../../components/buttons/mainButton";
import api from "../../../../services/api/user/index";
import MainAlert from "../../../../components/alerts/mainAlert";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [senhaOff, setSenhaOff] = useState(true);
  const [passValid, setPassValid] = useState(false);
  const [passInvalid, setPassInvalid] = useState(false);

  const [confPassValid, setConfPassValid] = useState(false);
  const [confPassInvalid, setConfPassInvalid] = useState(false);

  const [msgAlert, setMsgAlert] = useState(false);
  const [msgText, setMsgText] = useState(false);
  const [msgTitle, setMsgTitle] = useState(false);
  const [msgType, setMsgType] = useState(false);

  const navigate = useNavigate();

  const handleCadastro = () => {
    setIsLoading(true);

    if (
      name == "" ||
      lastName == "" ||
      email == "" ||
      pass == "" ||
      confPass == ""
    ) {
      setIsLoading(false);

      setMsgType("warning");
      setMsgTitle("Aviso");
      setMsgText("Preencha os todos os campos.");
      setMsgAlert(true);

      setTimeout(() => {
        setMsgAlert(false);
      }, 3000);
    } else if (pass != confPass) {
      setIsLoading(false);

      setMsgType("warning");
      setMsgTitle("Aviso");
      setMsgText(
        "O campo de confirmar senha precisa ser igual ao campo de senha."
      );
      setMsgAlert(true);

      setTimeout(() => {
        setMsgAlert(false);
      }, 3000);
    } else {
      const validarEmail = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      };

      if (validarEmail) {
        api.createUser(name, lastName, email, pass).then((res) => {
          console.log(res.status, res.data);
          if (res.status === 201) {
            setMsgType("success");
            setMsgTitle("Sucesso");
            setMsgText("Usuário criado com sucesso.");
            setMsgAlert(true);

            setTimeout(() => {
              handleRegister();
              setIsLoading(false);
              setMsgAlert(false);
            }, 3000);
          } else if (res.status === 400) {
            setIsLoading(false);

            setMsgType("error");
            setMsgTitle("Erro");
            setMsgText("O E-mail informado já possui uma conta criada.");
            setMsgAlert(true);

            setTimeout(() => {
              setMsgAlert(false);
            }, 3000);
          } else {
            setIsLoading(false);

            setMsgType("error");
            setMsgTitle("Erro");
            setMsgText(
              "Erro de conexão, por favor tente novamente mais tarde."
            );
            setMsgAlert(true);

            setTimeout(() => {
              setMsgAlert(false);
            }, 3000);
          }
        });
      } else {
        setIsLoading(false);

        setMsgType("warning");
        setMsgTitle("Aviso");
        setMsgText("Email inválido.");
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      }
    }

    setTimeout(() => {
      setMsgAlert(false);
    }, 3000);
  };

  const handleRegister = () => {
    navigate("/Login");
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
      style={{ backgroundImage: "url('/assets/images/bgAuth2.png')" }}
    >
      {/* Camada semi-transparente */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Conteúdo do card */}
      <div className="relative flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-xl">
          <h2 className="text-xl font-bold text-center mb-4">Cadastro</h2>

          {msgAlert && (
            <MainAlert type={msgType} message={msgText} title={msgTitle} />
          )}

          <div className="flex justify-around mt-4">
            <MainInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              type={"text"}
              placeholder={"Nome"}
              classInput={"w-full h-10"}
              classDiv={"w-5/12"}
              label={"Nome"}
              id={"name"}
            />
            <MainInput
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type={"text"}
              placeholder={"Sobrenome"}
              classInput={"w-full h-10"}
              classDiv={"w-5/12"}
              label={"Sobrenome"}
              id={"lastName"}
            />
          </div>

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

          <div>
            <div className="flex justify-around mt-6">
              <MainInput
                value={pass}
                onChange={handlePass}
                type={"password"}
                placeholder={"*********"}
                classInput={`w-full h-10 focus:outline-none ${
                  passValid
                    ? "!border-green-400 focus:!border-green-400"
                    : passInvalid
                    ? "!border-red-400 focus:!border-red-400"
                    : ""
                }`}
                classDiv={"w-5/12"}
                label={"Senha"}
                id={"password"}
              />

              <MainInput
                value={confPass}
                onChange={handleConfPass}
                type={"password"}
                placeholder={"*********"}
                classInput={`w-full h-10 focus:outline-none ${
                  confPassValid
                    ? "!border-green-400 focus:!border-green-400"
                    : confPassInvalid
                    ? "!border-red-400 focus:!border-red-400"
                    : ""
                }`}
                classDiv={"w-5/12"}
                label={"Cofirmar Senha"}
                id={"confpassword"}
              />
            </div>

            {senhaOff && (
              <p className="text-xs mt-2 justify-self-center text-red-500">
                A senha precisa ter pelo menos 8 dígitos e ter: número, letra e
                símbolo.
              </p>
            )}
          </div>

          <p
            className="w-full text-center mt-6 cursor-pointer text-red-500 font-bold text-sm"
            onClick={handleRegister}
          >
            Já possui uma conta?
          </p>

          <MainButton
            classButton={
              "w-11/12 h-12 bg-stone-950 hover:bg-stone-800 disabled:bg-stone-800 text-white"
            }
            classDiv={"mt-8"}
            classSpinner={"border-white"}
            isLoading={isLoading}
            onClick={handleCadastro}
            text={"Cadastrar"}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
