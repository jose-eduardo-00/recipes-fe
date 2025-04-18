import React, { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import person from "../../../assets/icons/person.svg";
import MainButton from "../../components/buttons/mainButton";
import MainInput from "../../components/inputs/mainInput";
import { baseUrl } from "../../services/config";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [isLoadingImg, setIsLoadingImg] = useState(null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [image, setImage] = useState(null);

  const hasFetched = useRef(false);
  const inputRef = useRef();

  const handleCheckToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);

      setName(decoded.firstName);
      setLastName(decoded.lastName);
      setEmail(decoded.email);

      if (!decoded.avatar == "") {
        setImage(`${baseUrl}${decoded.avatar}`);
      }
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      handleCheckToken();
    }
  }, []);

  const handleEditar = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const handleChangeImg = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoadingImg(true);
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setIsLoadingImg(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-gray-50 h-full w-9/12 px-6 py-10">
        <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-full p-4">
          <h2 className="text-gray-500 text-xl font-bold pb-2 border-b-3 mb-4 border-gray-200">
            Perfil
          </h2>

          <div className="p-5 flex flex-row gap-6">
            <div className="flex flex-col gap-2">
              <div className="bg-gray-200 w-50 h-50 rounded-xl flex justify-center items-center">
                {image == null ? (
                  <img src={person} alt="default" className="w-30" />
                ) : (
                  <img
                    src={image}
                    alt="Imagem do usuário"
                    className="w-full h-full rounded-xl"
                  />
                )}
              </div>

              <MainButton
                classButton="bg-gray-100 w-40 h-8 text-black !py-2.5 shadow-[0_8px_8px_rgba(0,0,0,0.1)] hover:bg-gray-200 transition"
                classDiv="justify-center mt-2"
                onClick={handleChangeImg}
                isLoading={isLoadingImg}
                text="Trocar Foto"
              />

              {/* Input invisível para selecionar a imagem */}
              <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            <div className="flex flex-col gap-4 w-1/3 mt-4">
              <MainInput
                label={"Nome"}
                placeholder={"Nome"}
                value={name}
                type={"text"}
                onChange={(e) => setName(e.target.value)}
                classInput={"w-full h-10 !border-gray-500"}
                classDiv={"w-full flex items-center"}
                classLabel={"w-full"}
              />
              <MainInput
                label={"Sobrenome"}
                placeholder={"Sobrenome"}
                value={lastName}
                type={"text"}
                onChange={(e) => setLastName(e.target.value)}
                classInput={"w-full h-10 !border-gray-500"}
                classDiv={"w-full flex items-center"}
                classLabel={"w-full"}
              />
            </div>
            <div className="flex flex-col gap-4 w-1/3 mt-4">
              <MainInput
                label={"Email"}
                placeholder={"Email"}
                value={email}
                type={"email"}
                onChange={(e) => setEmail(e.target.value)}
                classInput={"w-full h-10 !border-gray-500"}
                classDiv={"w-full flex items-center"}
                classLabel={"w-full"}
              />
            </div>
          </div>

          <div className="w-full flex flex-row gap-4 justify-end">
            <MainButton
              classButton={"bg-black w-50 text-white !py-2.5"}
              classDiv={"justify-end mt-2"}
              onClick={handleEditar}
              isLoading={isLoading}
              text={"Salvar Alterações"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
