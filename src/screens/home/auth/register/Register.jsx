import React, { useState } from "react";
import MainInput from "../../../../components/inputs/mainInput";
import MainButton from "../../../../components/buttons/mainButton";

const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleCadastro = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleRegister = () => {
    navigate("/Login");
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
          <h2 className="text-xl font-bold text-center">Cadastro</h2>

          <div className="flex justify-around mt-8">
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

          <div className="flex justify-around mt-6">
            <MainInput
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              type={"password"}
              placeholder={"*********"}
              classInput={"w-full h-10"}
              classDiv={"w-5/12"}
              label={"Senha"}
              id={"password"}
            />

            <MainInput
              value={confPass}
              onChange={(e) => setConfPass(e.target.value)}
              type={"password"}
              placeholder={"*********"}
              classInput={"w-full h-10"}
              classDiv={"w-5/12"}
              label={"Cofirmar Senha"}
              id={"confpassword"}
            />
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
