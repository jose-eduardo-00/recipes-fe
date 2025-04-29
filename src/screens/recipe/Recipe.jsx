import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../services/config";
import CamIcon from "../../../assets/icons/camIcon.svg";
import api from "../../services/api/recipe/index";
import apiCategory from "../../services/api/category/index";
import { useGlobalContext } from "../../context/context";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/modals/modalEditRecipe";
import MainButton from "../../components/buttons/mainButton";
import MainInput from "../../components/inputs/mainInput";
import MainSelect from "../../components/inputs/mainSelect";
import MainAlert from "../../components/alerts/mainAlert";

const Recipe = () => {
  const location = useLocation();
  const { id, recipeItem } = location.state;

  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [orderedImages, setOrderedImages] = useState([]);
  const [recipe, setRecipe] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(null);

  //edit
  const inputRef = useRef(null);

  const [tab, setTab] = useState(1);
  const [nameRecipe, setNameRecipe] = useState("");
  const [descriptionRecipe, setDescriptionRecipe] = useState("");

  const [categorysRecipe, setCategorysRecipe] = useState(null);
  const [selectedOption, setSelectedOption] = useState([]);

  const [ingredientesRecipe, setIngredientesRecipe] = useState([
    { name: "", quantity: "" },
  ]);

  const [preparationMethodRecipe, setPreparationMethodRecipe] = useState([
    { description: "", order: 1 },
  ]);

  const [imagesRecipe, setImagesRecipe] = useState([]);

  const [msgAlert, setMsgAlert] = useState(false);
  const [msgText, setMsgText] = useState(false);
  const [msgTitle, setMsgTitle] = useState(false);
  const [msgType, setMsgType] = useState(false);

  const { token } = useGlobalContext();

  const navigate = useNavigate();

  const getAllCategorys = () => {
    apiCategory.allCategorys().then((res) => {
      if (res.status === 200) {
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
        setCategorysRecipe(newCategorys);
      }
    });
  };

  const handleGetRecipe = () => {
    api.recipe(id).then((res) => {
      console.log(res.data.recipes);
      if (res.status === 200) {
        setRecipe(res.data.recipes);
        setOrderedImages(
          res.data.recipes?.images
            ?.slice()
            ?.sort((a, b) => a.order - b.order) || []
        );
      }
    });
  };

  const editRecipe = () => {
    setNameRecipe(recipe.name);
    setDescriptionRecipe(recipe.desciption);

    setImagesRecipe(recipe.images);

    const dataCategorys = recipe.categories;
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

    setCategorysRecipe((prevCategorias) =>
      prevCategorias.filter(
        (cat) => !newCategorys.some((item) => item.id === cat.id)
      )
    );

    setSelectedOption((prevSelected) => {
      const updatedSelected = [...prevSelected];

      newCategorys.forEach((item) => {
        const alreadyExists = updatedSelected.some(
          (selected) => selected.id === item.id
        );
        if (!alreadyExists) {
          updatedSelected.push(item);
        }
      });

      return updatedSelected;
    });

    const ingredientes = recipe.ingredients
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        name: item.name,
        quantity: item.quantity,
      }));

    setIngredientesRecipe(ingredientes);

    const preparationMethod = recipe.steps
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        description: item.description,
        order: item.order,
      }));

    setPreparationMethodRecipe(preparationMethod);
  };

  const handleRecommendedRecipes = (id, recipeId) => {
    api.recommendedRecipes(recipeItem.userId, id, recipeId).then((res) => {
      if (res.status === 200) {
        setRecommendedRecipes(res.data.recipes.slice(0, 20));
      } else {
        setRecommendedRecipes([]);
      }
    });
  };

  const handleCheckToken = () => {
    if (token) {
      const decoded = jwtDecode(token);
      handleRecommendedRecipes(decoded.userId, id);
    }
  };

  useEffect(() => {
    if (id) {
      handleGetRecipe();
      getAllCategorys();
      handleCheckToken();
    }
  }, [id]);

  useEffect(() => {
    if (recipe && categorysRecipe) {
      editRecipe();
    }
  }, [recipe]);

  const handleRecipe = (item) => {
    navigate("../recipe", {
      state: { id: item.id, recipeItem: item },
    });
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex + 6 < recommendedRecipes.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevImg = () => {
    if (currentImgIndex > 0) {
      setCurrentImgIndex(currentImgIndex - 1);
    }
  };

  const goToNextImg = () => {
    if (currentImgIndex !== 2) {
      setCurrentImgIndex(currentImgIndex + 1);
    }
  };

  const handleOptionCategory = (item) => {
    setCategorysRecipe((prevCategorias) =>
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
    if (ingredientesRecipe.length < 15) {
      setIngredientesRecipe([
        ...ingredientesRecipe,
        { name: "", quantity: "" },
      ]);
    }
  };

  const removeIngrediente = (indexToRemove) => {
    setIngredientesRecipe((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleIngredienteChange = (index, field, value) => {
    const updated = [...ingredientesRecipe];

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
    setIngredientesRecipe(updated);
  };

  const addMethod = () => {
    if (preparationMethodRecipe.length < 10) {
      setPreparationMethodRecipe([
        ...preparationMethodRecipe,
        { description: "", order: preparationMethodRecipe.length + 1 },
      ]);
    }
  };

  const removeMethod = (indexToRemove) => {
    setPreparationMethodRecipe((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleMethodChange = (index, value) => {
    const updated = [...preparationMethodRecipe];
    updated[index]["description"] = value;
    updated[index]["order"] = index + 1;
    setPreparationMethodRecipe(updated);
  };

  const handleAddImage = (event) => {
    const file = event.target.files[0];
    if (file && imagesRecipe.length < 3) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (allowedTypes.includes(file.type)) {
        setImagesRecipe([...imagesRecipe, file]);
      } else {
        setMsgType("warning");
        setMsgTitle("Aviso");
        setMsgText(
          "A imagem precisa estar em um desses formatos: jpg, jpeg ou png."
        );
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      }
    }
  };

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImagesRecipe((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const isRecipeModified = () => {
    if (recipe.name !== nameRecipe) return true;
    if (recipe.desciption !== descriptionRecipe) return true;

    // Comparar categorias
    const recipeCategoriesIds = recipe.categories.map((cat) => cat.id).sort();
    const selectedCategoriesIds = selectedOption.map((cat) => cat.id).sort();
    if (
      JSON.stringify(recipeCategoriesIds) !==
      JSON.stringify(selectedCategoriesIds)
    )
      return true;

    // Comparar imagens
    const recipeImagesUrls = recipe.images.map((img) => img.imageUrl).sort();
    const imagesRecipeUrls = imagesRecipe
      .map((img) => img.imageUrl || img.name)
      .sort(); // cuidado: img pode ser arquivo novo
    if (JSON.stringify(recipeImagesUrls) !== JSON.stringify(imagesRecipeUrls))
      return true;

    // Comparar ingredientes
    const recipeIngredients = recipe.ingredients
      .map((ing) => ({ name: ing.name, quantity: ing.quantity }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const ingredientes = ingredientesRecipe
      .map((ing) => ({ name: ing.name, quantity: ing.quantity }))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (JSON.stringify(recipeIngredients) !== JSON.stringify(ingredientes))
      return true;

    // Comparar métodos de preparo
    const recipeMethods = recipe.steps
      .map((step) => ({ description: step.description, order: step.order }))
      .sort((a, b) => a.order - b.order);
    const methods = preparationMethodRecipe
      .map((step) => ({ description: step.description, order: step.order }))
      .sort((a, b) => a.order - b.order);
    if (JSON.stringify(recipeMethods) !== JSON.stringify(methods)) return true;

    return false; // Se chegou até aqui, nada foi modificado
  };

  const handleSaveEdit = () => {
    setIsLoadingEdit(true);
    if (isRecipeModified()) {
      const categoryIds = selectedOption.map((option) => option.id);
      // console.log(imagesRecipe);

      api
        .updateRecipe(
          recipe.id,
          nameRecipe,
          descriptionRecipe,
          categoryIds,
          ingredientesRecipe,
          preparationMethodRecipe,
          imagesRecipe
        )
        .then((res) => {
          if (res.status === 200) {
            handleGetRecipe();
            setMsgType("success");
            setMsgTitle("Sucesso");
            setMsgText("Receita modificada.");
            setMsgAlert(true);

            setTimeout(() => {
              setMsgAlert(false);
              setIsLoadingEdit(false);
              setIsModalOpen(false);
            }, 3000);
          } else {
            setMsgType("error");
            setMsgTitle("Erro");
            setMsgText("Falha ao tentar editar, tente novamente mais tarde.");
            setMsgAlert(true);
            setIsLoadingEdit(false);

            setTimeout(() => {
              setMsgAlert(false);
            }, 3000);
          }
        });
    } else {
      setMsgType("warning");
      setMsgTitle("Aviso");
      setMsgText("Você não mudou nenhum campo.");
      setMsgAlert(true);
      setIsLoadingEdit(false);

      setTimeout(() => {
        setMsgAlert(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-gray-50 h-full py-10 flex flex-col items-center">
      <h2 className="text-gray-800 text-2xl font-bold text-center mb-8 bg-gray-200 w-full py-2 relative">
        {recipe && recipe.name}
        <MainButton
          classButton={"text-sm text-white"}
          classDiv={"absolute right-5 top-1/7 bg-black rounded-lg"}
          disabled={false}
          isLoading={false}
          onClick={() => setIsModalOpen(true)}
          text={"Editar Receita"}
        />
      </h2>
      <div className="relative">
        {recipe && orderedImages.length > 0 ? (
          <>
            <img
              src={`${baseUrl}${orderedImages[currentImgIndex].imageUrl}`}
              alt="Foto da receita"
              className="w-200 h-100 rounded-2xl"
            />

            <button
              className={`cursor-pointer absolute -left-10 top-1/2 transform -translate-y-1/2 bg-gray-600 p-2 rounded-full text-white z-10 ${
                currentImgIndex === 0 ? "opacity-50 !cursor-default" : ""
              }`}
              onClick={goToPrevImg}
              disabled={currentImgIndex === 0} // Desabilita o botão quando estiver no primeiro slide
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <button
              className={`cursor-pointer absolute -right-10 top-1/2 transform -translate-y-1/2 bg-gray-600 p-2 rounded-full text-white z-10 ${
                currentImgIndex === recipe.images.length - 1 ||
                recipe.images.length === 0
                  ? "opacity-50 !cursor-default"
                  : ""
              }`}
              onClick={goToNextImg}
              disabled={
                currentImgIndex === recipe.images.length - 1 ||
                recipe.images.length === 0
              }
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </>
        ) : (
          <div className="w-200 h-80 rounded-2xl bg-gray-400 flex items-center justify-center">
            <img src={CamIcon} className="w-10 h-10" alt="" />
          </div>
        )}
      </div>

      <p className="text-center mt-4 w-1/2 font-medium">
        {recipe && recipe.desciption}
      </p>

      <h4 className="mt-12 font-bold text-2xl text-gray-700 bg-gray-200 w-full text-center py-2">
        Categorias
      </h4>
      <div className="flex flex-row items-center gap-4 mt-4">
        {recipe &&
          recipe.categories.map((item) => {
            return (
              <div
                key={item.id}
                className="px-6 py-2 bg-gray-300 flex items-center justify-center rounded-md"
              >
                <span className="font-medium">{item.name}</span>
              </div>
            );
          })}
      </div>

      <h4 className="mt-12 font-bold text-2xl text-gray-700 bg-gray-200 w-full text-center py-2">
        Ingredientes
      </h4>
      <div className="flex flex-row justify-around w-full mt-4">
        {recipe &&
          (() => {
            const meio = Math.ceil(recipe.ingredients.length / 2);
            const primeiraMetade = recipe.ingredients.slice(0, meio);
            const segundaMetade = recipe.ingredients.slice(meio);

            return (
              <>
                <div className="flex flex-col">
                  {primeiraMetade.map((item, index) => (
                    <p key={index} className="text-xl">
                      <span className="font-medium mr-3">{item.quantity}x</span>
                      {item.name}
                    </p>
                  ))}
                </div>
                <div className="flex flex-col">
                  {segundaMetade.map((item, index) => (
                    <p key={index} className="text-xl">
                      <span className="font-medium mr-3">{item.quantity}x</span>
                      {item.name}
                    </p>
                  ))}
                </div>
              </>
            );
          })()}
      </div>

      <h4 className="mt-12 font-bold text-2xl text-gray-700 bg-gray-200 w-full text-center py-2">
        Modo de Preparo
      </h4>
      <div className="flex flex-col w-full px-10 mt-8 gap-6">
        {recipe &&
          recipe.steps
            .slice() // faz uma cópia para não alterar o original
            .sort((a, b) => a.order - b.order) // ordena pelo campo order
            .map((item) => (
              <div key={item.id} className="flex flex-row items-center gap-4">
                <p className="font-medium text-xl">{item.order}</p>
                <div className="w-full px-6 py-2">
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
      </div>

      {recommendedRecipes.length > 0 && (
        <>
          <h4 className="mt-12 font-bold text-2xl text-gray-700 bg-gray-200 w-full text-center py-2">
            Receitas recomendadas
          </h4>
          <div className="relative w-full mt-6 px-4 max-w-screen-lg mx-auto">
            <div className="flex overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out gap-4 px-8"
                style={{
                  transform: `translateX(-${
                    (currentIndex / recommendedRecipes.length) * 100
                  }%)`,
                  width: `${recommendedRecipes.length * 100}%`,
                }}
              >
                {recommendedRecipes.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleRecipe(item)}
                    className="flex flex-col w-35 items-center gap-2 cursor-pointer"
                  >
                    {item.images.length > 0 ? (
                      item.images.map((img) => {
                        if (img.order === 1) {
                          return (
                            <img
                              src={`${baseUrl}${img.imageUrl}`}
                              className="w-35 h-35 object-cover rounded-2xl"
                              alt=""
                              key={img.id}
                            />
                          );
                        }
                      })
                    ) : (
                      <div className="w-full h-35 bg-gray-400 rounded-2xl flex items-center justify-center">
                        <img src={CamIcon} className="w-10 h-10" alt="" />
                      </div>
                    )}
                    <h4 className="text-center font-medium text-sm mt-2">
                      {item.name}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 p-2 rounded-full text-white z-10 ${
                currentIndex === 0 ? "opacity-50 !cursor-default" : ""
              }`}
              onClick={goToPrev}
              disabled={currentIndex === 0} // Desabilita o botão quando estiver no primeiro slide
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <button
              className={`cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 p-2 rounded-full text-white z-10 ${
                currentIndex + 6 === recommendedRecipes.length ||
                recommendedRecipes.length <= 6
                  ? "opacity-50 !cursor-default"
                  : ""
              }`}
              onClick={goToNext}
              disabled={
                currentIndex + 6 === recommendedRecipes.length ||
                recommendedRecipes.length <= 6
              }
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Receita"
        classCard={"!max-w-4xl"}
        isLoading={isLoadingEdit}
        handleSaveEdit={handleSaveEdit}
      >
        <div className="flex flex-row mb-4">
          <h2
            onClick={() => setTab(1)}
            className="border-r-1 border-b-1 border-gray-500 px-6 pb-2 py-1 cursor-pointer hover:bg-gray-100 transition-all"
          >
            Infos
          </h2>
          <h2
            onClick={() => setTab(2)}
            className="border-r-1 border-b-1 border-gray-500 px-6 pb-2 py-1 cursor-pointer hover:bg-gray-100 transition-all"
          >
            Ingredientes
          </h2>
          <h2
            onClick={() => setTab(3)}
            className="border-r-1 border-b-1 border-gray-500 px-6 pb-2 py-1 cursor-pointer hover:bg-gray-100 transition-all"
          >
            Passos
          </h2>
        </div>

        {msgAlert && (
          <MainAlert type={msgType} message={msgText} title={msgTitle} />
        )}

        {tab == 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-8 w-full">
              <div className="flex flex-col w-1/2">
                <MainInput
                  value={nameRecipe}
                  onChange={(e) => setNameRecipe(e.target.value)}
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
                  options={categorysRecipe}
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
                  value={descriptionRecipe}
                  onChange={(e) => setDescriptionRecipe(e.target.value)}
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

            <div className="w-full mt-4">
              <div className="flex flex-row gap-4">
                {imagesRecipe.map((img, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 w-50 h-50 rounded-xl relative flex justify-center items-center overflow-hidden"
                  >
                    {img instanceof File ? (
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <img
                        src={`${baseUrl}${img.imageUrl}`}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    )}
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

                {imagesRecipe.length < 3 && (
                  <div className="bg-gray-200 w-50 h-50 rounded-xl relative flex justify-center items-center cursor-pointer">
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/jpeg, image/jpg, image/png"
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

        {tab == 2 && (
          <div className="w-full mt-6">
            {console.log(ingredientesRecipe)}
            {ingredientesRecipe.map((ingrediente, index) => (
              <div key={index} className="flex flex-row w-11/12 gap-4 mb-2">
                <MainInput
                  value={ingrediente.name}
                  onChange={(e) =>
                    handleIngredienteChange(index, "name", e.target.value)
                  }
                  type={"text"}
                  placeholder={"Nome"}
                  classInput={"w-full h-10 !border-gray-400"}
                  classDiv={"w-8/12 flex items-center"}
                  classLabel={"w-full ps-2"}
                  label={`Ingrediente ${index + 1}`}
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
                  classDiv={"w-3/12 flex items-center"}
                  classLabel={"w-full ps-2"}
                  label={"Quantidade"}
                  id={`quantidade-i-${index}`}
                />

                <div className="w-1/12 flex flex-row gap-3">
                  {index + 1 === ingredientesRecipe.length &&
                  ingredientesRecipe.length < 15 ? (
                    <div className="flex items-end w-1/2">
                      <button
                        type="button"
                        onClick={addIngrediente}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-1/2"></div>
                  )}
                  {index + 1 === ingredientesRecipe.length && index != 0 ? (
                    <div className="flex items-end w-1/2">
                      <button
                        type="button"
                        onClick={() => removeIngrediente(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-1/2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab == 3 && (
          <div className="w-full mt-6">
            {preparationMethodRecipe.map((method, index) => (
              <div key={index} className="flex flex-row w-full gap-4 mb-2">
                <MainInput
                  value={method.description}
                  onChange={(e) => handleMethodChange(index, e.target.value)}
                  type={"text"}
                  placeholder={"Descrição do passo no preparo da receita"}
                  classInput={"w-full h-10 !border-gray-400"}
                  classDiv={"w-11/12 flex items-center mb-3"}
                  classLabel={"w-full ps-2"}
                  label={`Descrição do passo ${index + 1}`}
                  id={`description-i-${index}`}
                />

                <div className="w-2/12 flex flex-row gap-1">
                  {index + 1 === preparationMethodRecipe.length &&
                  preparationMethodRecipe.length < 10 ? (
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
                    <div className="w-1/3"></div>
                  )}
                  {index + 1 === preparationMethodRecipe.length &&
                  index != 0 ? (
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
                    <div className="w-1/3"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Recipe;
