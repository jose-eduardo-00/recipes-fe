import React, { useEffect, useRef, useState } from "react";
import MainInput from "../../components/inputs/mainInput";
import MainButton from "../../components/buttons/mainButton";
import api from "../../services/api/category/index";
import MainAlert from "../../components/alerts/mainAlert";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Category = () => {
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);
  const [categorys, setCategorys] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [msgAlert, setMsgAlert] = useState(false);
  const [msgAlert1, setMsgAlert1] = useState(false);
  const [msgText, setMsgText] = useState(false);
  const [msgTitle, setMsgTitle] = useState(false);
  const [msgType, setMsgType] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const hasFetched = useRef(false);

  const itemsPerPage = 8;

  const handleCheckToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      handleCheckToken();
      getAllCategorys();
    }
  }, []);

  const getAllCategorys = () => {
    api.allCategorys().then((res) => {
      if (res.status === 200) {
        const novasCategorias = res.data.categorys;
        const totalPages = Math.ceil(novasCategorias.length / itemsPerPage);
        const paginaSegura = Math.min(currentPage, totalPages) || 1;

        setCurrentPage(paginaSegura);
        setCategorys(novasCategorias);
      }
    });
  };

  const handleSalvar = () => {
    setIsLoading(true);

    if (name == "") {
      setIsLoading(false);

      setMsgType("warning");
      setMsgTitle("Aviso");
      setMsgText("Preencha o campo de nome.");
      setMsgAlert(true);

      setTimeout(() => {
        setMsgAlert(false);
      }, 3000);
    } else {
      api.createCategory(name, user.id).then((res) => {
        if (res.status === 201) {
          setIsLoading(false);

          setName("");
          getAllCategorys();
          setMsgType("success");
          setMsgTitle("Sucesso");
          setMsgText("Categoria salva com sucesso.");
          setMsgAlert(true);

          setTimeout(() => {
            setMsgAlert(false);
          }, 3000);
        } else if (res.status === 400) {
          setIsLoading(false);

          setMsgType("error");
          setMsgTitle("Erro");
          setMsgText("Essa categoria já existe.");
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

  const handleDelete = (id) => {
    api.deleteCategory(id).then((res) => {
      if (res.status === 200) {
        getAllCategorys();
      } else {
        setMsgType("error");
        setMsgTitle("Erro");
        setMsgText("Erro de conexão, tente novamente mais tarde.");
        setMsgAlert1(true);

        setTimeout(() => {
          setMsgAlert1(false);
        }, 3000);
      }
    });
  };

  return (
    <div className="bg-gray-50 h-full py-10 w-full flex flex-row justify-around">
      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-5/12 p-4 h-fit">
        <h2 className="text-gray-500 text-xl font-bold pb-2 border-b-3 border-gray-200 mb-2">
          Criar Categoria
        </h2>

        {msgAlert && (
          <MainAlert type={msgType} message={msgText} title={msgTitle} />
        )}

        <div className="flex flex-col gap-8 pb-4">
          <MainInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            type={"text"}
            placeholder={"Nome da categoria"}
            classInput={"w-full h-10 !border-gray-300"}
            classDiv={"w-full mt-4 flex items-center"}
            classLabel={"w-full ps-2"}
            label={"Nome"}
            id={"nome"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSalvar();
              }
            }}
          />
        </div>

        <MainButton
          classButton={"bg-black w-30 text-white !py-2.5"}
          classDiv={"justify-end mt-2"}
          onClick={handleSalvar}
          isLoading={isLoading}
          text={"Salvar"}
        />
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-4/12 p-4">
        <h2 className="text-gray-500 text-xl font-bold pb-2 border-b-3 border-gray-200 mb-2">
          Categorias
        </h2>

        {msgAlert1 && (
          <MainAlert type={msgType} message={msgText} title={msgTitle} />
        )}

        <div className="w-full flex flex-col justify-center mt-6 gap-4">
          {categorys && categorys.length > 0 && (
            <>
              {categorys
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((e) => (
                  <div
                    key={e.id}
                    className="w-full border-b-2 border-gray-300 px-3 py-1 flex justify-between"
                  >
                    <span className="font-bold">{e.name}</span>
                    <button
                      className="cursor-pointer me-2"
                      onClick={() => handleDelete(e.id)}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="text-red-500"
                      />
                    </button>
                  </div>
                ))}

              {/* Paginação */}
              <div className="flex justify-center items-center gap-4 mt-4">
                <MainButton
                  classButton={`w-30  text-white ${
                    currentPage === 1 ? "bg-gray-300" : "bg-black"
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  text={"Anterior"}
                  disabled={currentPage === 1}
                />
                <span className="text-sm">
                  {currentPage} de {Math.ceil(categorys.length / itemsPerPage)}
                </span>
                <MainButton
                  classButton={`w-30 text-white ${
                    currentPage === Math.ceil(categorys.length / itemsPerPage)
                      ? "bg-gray-300"
                      : "bg-black"
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(categorys.length / itemsPerPage)
                      )
                    )
                  }
                  text={"Próximo"}
                  disabled={
                    currentPage === Math.ceil(categorys.length / itemsPerPage)
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
