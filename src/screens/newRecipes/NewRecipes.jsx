import React, { useEffect, useRef, useState } from "react";
import MainInput from "../../components/inputs/mainInput";
import MainButton from "../../components/buttons/mainButton";
import apiCategory from "../../services/api/category/index";
import MainSelect from "../../components/inputs/mainSelect";
import MainAlert from "../../components/alerts/mainAlert";
import api from "../../services/api/recipe/index";
import { jwtDecode } from "jwt-decode";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "../../context/context";

const NewRecipes = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const [msgAlert, setMsgAlert] = useState(false);
  const [msgText, setMsgText] = useState(false);
  const [msgTitle, setMsgTitle] = useState(false);
  const [msgType, setMsgType] = useState(false);

  const [categorys, setCategorys] = useState(null);
  const [selectedOption, setSelectedOption] = useState([]);

  const [ingredientes, setIngredientes] = useState([
    { name: "", quantity: "" },
  ]);

  const [preparationMethod, setPreparationMethod] = useState([
    { description: "", order: 1 },
  ]);

  const [recipe, setRecipe] = useState(null);

  const [btnImage, setBtnImage] = useState(1);
  const [images, setImages] = useState([]);

  const inputRef = useRef(null);

  const { token } = useGlobalContext();

  const handleCheckToken = () => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  };

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
    if (token) {
      handleCheckToken();
      getAllCategorys();
    }
  }, [token]);

  const handleSalvarReceita = () => {
    setIsLoadingSave(true);

    if (step == 1) {
      if (name == "" || description == "") {
        setIsLoadingSave(false);

        setMsgType("warning");
        setMsgTitle("Aviso");
        setMsgText("Preencha os campos de nome e descrição.");
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      } else if (selectedOption.length < 1) {
        setIsLoadingSave(false);

        setMsgType("warning");
        setMsgTitle("Aviso");
        setMsgText("Adicione pelo menos uma categoria a sua receita.");
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      } else {
        setIsLoadingSave(false);
        setStep(2);
      }
    } else if (step === 2) {
      const temIngredienteInvalido = ingredientes.some(
        (item) =>
          item.name.trim() === "" ||
          item.quantity === "" ||
          item.quantity === null
      );

      if (temIngredienteInvalido) {
        setIsLoadingSave(false);

        setMsgType("warning");
        setMsgTitle("Aviso");
        setMsgText("Preencha os campos de nome e quantidade dos ingredientes.");
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      } else {
        setIsLoadingSave(false);

        setStep(3);
      }
    } else if (step === 3) {
      const methodInvalid = preparationMethod.some(
        (item) =>
          item.description.trim() === "" ||
          item.description === "" ||
          item.description === null
      );

      if (methodInvalid) {
        setIsLoadingSave(false);

        setMsgType("warning");
        setMsgTitle("Aviso");
        setMsgText("Preencha os campos de nome e quantidade dos ingredientes.");
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      } else {
        const categoryIds = selectedOption.map((option) => option.id);

        api
          .createRecipe(
            name,
            description,
            user.id,
            categoryIds,
            ingredientes,
            preparationMethod,
            images
          )
          .then((res) => {
            console.log(res.status, res.data);
            if (res.status === 201) {
              setName("");
              setDescription("");
              setSelectedOption([]);
              setImages([]);
              getAllCategorys();

              setMsgType("success");
              setMsgTitle("Sucesso");
              setMsgText("Receita salva com sucesso!.");
              setMsgAlert(true);

              setTimeout(() => {
                setIsLoadingSave(false);
                setMsgAlert(false);
                setStep(1);

                setIngredientes([{ name: "", quantity: "" }]);
                setPreparationMethod([{ description: "", order: 1 }]);
              }, 3000);
            } else {
              setIsLoadingSave(false);

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
    }
  };

  const handleVoltar = () => {
    setStep(step - 1);
  };

  const handleOptionCategory = (item) => {
    console.log(item);
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

  const addIngrediente = () => {
    setIngredientes([...ingredientes, { name: "", quantity: "" }]);
  };

  const removeIngrediente = (indexToRemove) => {
    setIngredientes((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleIngredienteChange = (index, field, value) => {
    const updated = [...ingredientes];

    let newValue = value;

    if (field === "quantity") {
      const number = Number(value);

      if (value === "" || isNaN(number) || number < 0) {
        newValue = "";
      } else {
        newValue = number;
      }
    }

    updated[index][field] = newValue;
    setIngredientes(updated);
  };

  const addMethod = () => {
    setPreparationMethod([
      ...preparationMethod,
      { description: "", order: preparationMethod.length + 1 },
    ]);
  };

  const removeMethod = (indexToRemove) => {
    setPreparationMethod((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleMethodChange = (index, value) => {
    const updated = [...preparationMethod];
    updated[index]["description"] = value;
    updated[index]["order"] = index + 1;
    setPreparationMethod(updated);
  };

  const handleAddImage = (event) => {
    const file = event.target.files[0];
    if (file && images.length < 3) {
      setImages([...images, file]);
    }
  };

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="bg-gray-50 h-full px-6 py-10 ">
      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-full p-4">
        <h2 className="text-gray-500 text-xl font-bold pb-2 border-b-3 mb-4 border-gray-200">
          Criar Receita | Passo {step}
        </h2>

        {msgAlert && (
          <MainAlert type={msgType} message={msgText} title={msgTitle} />
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-8 w-full">
              <div className="flex flex-col w-1/2">
                <MainInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type={"text"}
                  placeholder={"Nome"}
                  classInput={"w-full h-10 !border-gray-400"}
                  classDiv={"w-full mt-4 flex items-center"}
                  classLabel={"w-full ps-2"}
                  label={`Nome da Receita`}
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

                <div className="flex flex-row flex-wrap gap-4 mt-6">
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
                  classDiv={"w-full mt-4 flex items-center"}
                  classLabel={"w-full h-full ps-2"}
                  label={"Descrição"}
                  id={"descrição"}
                />
              </div>
            </div>

            <div className="w-full">
              <div className="flex flex-row gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 w-50 h-50 rounded-xl relative flex justify-center items-center overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute w-12 h-8">
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="w-full h-full bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                    </div>
                  </div>
                ))}

                {images.length < 3 && (
                  <div className="bg-gray-200 w-50 h-50 rounded-xl relative flex justify-center items-center cursor-pointer">
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAddImage}
                      className="hidden"
                    />
                    <div
                      className="absolute w-12 h-8"
                      onClick={triggerFileInput}
                    >
                      <button className="w-full h-full bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer">
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full">
            <h2 className="text-gray-500 font-bold text-xl mb-4 mt-4">
              Ingredientes
            </h2>

            {ingredientes.map((ingrediente, index) => (
              <div key={index} className="flex flex-row w-8/12 gap-4 mb-2">
                <MainInput
                  value={ingrediente.name}
                  onChange={(e) =>
                    handleIngredienteChange(index, "name", e.target.value)
                  }
                  type={"text"}
                  placeholder={"Nome"}
                  classInput={"w-full h-10 !border-gray-400"}
                  classDiv={"w-7/12 flex items-center"}
                  classLabel={"w-full ps-2"}
                  label={`Nome`}
                  id={`nome-i-${index}`}
                />

                <MainInput
                  value={ingrediente.quantity}
                  onChange={(e) =>
                    handleIngredienteChange(index, "quantity", e.target.value)
                  }
                  type={"number"}
                  placeholder={"00"}
                  classInput={"w-full h-10 !border-gray-400"}
                  classDiv={"w-5/12 flex items-center"}
                  classLabel={"w-full ps-2"}
                  label={"Quantidade"}
                  id={`quantidade-i-${index}`}
                />

                <div className="w-2/12 flex flex-row gap-2">
                  {index + 1 === ingredientes.length ? (
                    <div className="flex items-end w-1/3">
                      <button
                        type="button"
                        onClick={addIngrediente}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-2/12"></div>
                  )}
                  {index + 1 === ingredientes.length && index != 0 ? (
                    <div className="flex items-end w-1/3">
                      <button
                        type="button"
                        onClick={() => removeIngrediente(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-2/12"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="w-full">
            <h2 className="text-gray-500 font-bold text-xl mb-4">
              Modo de Preparo
            </h2>

            {preparationMethod.map((method, index) => (
              <div key={index} className="flex flex-row w-8/12 gap-4 mb-2">
                <MainInput
                  value={method.description}
                  onChange={(e) => handleMethodChange(index, e.target.value)}
                  type={"text"}
                  placeholder={"Descrição do passo no preparo da receita"}
                  classInput={"w-full h-10 !border-gray-400"}
                  classDiv={"w-7/12 flex items-center mb-3"}
                  classLabel={"w-full ps-2"}
                  label={`Descrição do passo ${index + 1}`}
                  id={`description-i-${index}`}
                />

                <div className="w-2/12 flex flex-row gap-2">
                  {index + 1 === preparationMethod.length ? (
                    <div className="flex items-end mb-3 w-1/3">
                      <button
                        type="button"
                        onClick={addMethod}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-2/12"></div>
                  )}
                  {index + 1 === preparationMethod.length && index != 0 ? (
                    <div className="flex items-end mb-3 w-1/3">
                      <button
                        type="button"
                        onClick={() => removeMethod(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-2/12"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

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
            onClick={handleSalvarReceita}
            isLoading={isLoadingSave}
            text={step == 3 ? "Salvar" : "Próximo"}
          />
        </div>
      </div>
    </div>
  );
};

export default NewRecipes;
