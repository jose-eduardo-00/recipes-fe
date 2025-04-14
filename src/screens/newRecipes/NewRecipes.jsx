import React, { useEffect, useRef, useState } from "react";
import MainInput from "../../components/inputs/mainInput";
import MainButton from "../../components/buttons/mainButton";
import apiCategory from "../../services/api/category/index";
import MainSelect from "../../components/inputs/mainSelect";

const NewRecipes = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const [categorys, setCategorys] = useState(null);
  const [selectedOption, setSelectedOption] = useState([]);

  const hasFetched = useRef(false);

  const getAllCategorys = () => {
    apiCategory.allCategorys().then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        const dataCategorys = res.data.categorys;
        const newCategorys = dataCategorys.map((e) => {
          return {
            value: e.name,
            label: e.name,
            id: e.id,
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
            userId: e.userId,
          };
        });
        setCategorys(newCategorys);
      }
    });
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getAllCategorys();
    }
  }, []);

  const handleSalvar = () => {
    if (step === 3) {
      setIsLoadingSave(true);

      setTimeout(() => {
        setIsLoadingSave(false);
      }, 3000);
    } else {
      setStep(step + 1);
    }
  };
  const handleVoltar = () => {
    setStep(step - 1);
  };

  const handleOptionCategory = (item) => {
    setCategorys((prevCategorias) =>
      prevCategorias.filter((cat) => cat.id !== item.id)
    );

    setSelectedOption((prev) => [...prev, item]);
  };

  const handleRemoveCategoria = (item) => {
    setSelectedOption((prevCategorias) =>
      prevCategorias.filter((cat) => cat.id !== item.id)
    );

    setCategorys((prev) => [...prev, item]);
  };

  return (
    <div className="bg-gray-50 h-full px-6 py-10">
      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-full p-4">
        <h2 className="text-gray-500 text-xl font-bold pb-2 border-b-3 border-gray-200">
          Criar Receita | Passo {step}
        </h2>

        {step === 1 && (
          <div className="flex flex-row gap-8 w-full">
            <div className="flex flex-col w-1/2">
              <MainInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                type={"text"}
                placeholder={"Nome"}
                classInput={"w-full h-10 !border-gray-400"}
                classDiv={"w-full mt-6 flex items-center"}
                classLabel={"w-full ps-2"}
                label={"Nome"}
                id={"nome"}
              />

              <MainSelect
                id="categorys"
                label="Categorias"
                placeholder="Selecione uma categoria."
                value={""}
                onChange={(e) => handleOptionCategory(e)}
                options={categorys}
                classDiv="w-6/12 mt-4"
                classSelect="!border-gray-400"
                classLabel="ps-1"
              />

              <div className="flex flex-row flex-wrap gap-4 mt-6 ">
                {selectedOption.length > 0 &&
                  selectedOption.map((e) => {
                    return (
                      <span
                        className="px-2 py-1 rounded-md bg-gray-100 flex flex-row gap-2"
                        key={e.id}
                      >
                        <span>{e.value}</span>
                        <button
                          onClick={() => handleRemoveCategoria(e)}
                          className="text-red-500 font-bold px-1  rounded-md cursor-pointer hover:scale-105 transition-transform"
                        >
                          X
                        </button>
                      </span>
                    );
                  })}
              </div>
            </div>

            <div className="w-6/12">
              <MainInput
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type={"textarea"}
                placeholder={"Descrição"}
                classInput={"w-full h-40 !border-gray-400"}
                classDiv={"w-full mt-6 flex items-center"}
                classLabel={"w-full h-full ps-2"}
                label={"Descrição"}
                id={"descrição"}
              />
            </div>
          </div>
        )}

        {step === 2 && <div className="w-full"></div>}

        {step === 3 && <div className="w-full"></div>}

        <div className="w-full flex flex-row gap-4 justify-end mt-6">
          {step !== 1 && !isLoadingSave && (
            <MainButton
              classButton={"bg-black w-30 text-white !py-2.5"}
              classDiv={"justify-end mt-2"}
              onClick={handleVoltar}
              isLoading={isLoading}
              text={"Voltar"}
            />
          )}
          <MainButton
            classButton={"bg-black w-30 text-white !py-2.5"}
            classDiv={"justify-end mt-2"}
            onClick={handleSalvar}
            isLoading={isLoadingSave}
            text={step == 3 ? "Salvar" : "Próximo"}
          />
        </div>
      </div>
    </div>
  );
};

export default NewRecipes;
