import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../services/config";
import CamIcon from "../../../assets/icons/camIcon.svg";
import api from "../../services/api/recipe/index";
import { useGlobalContext } from "../../context/context";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Recipe = () => {
  const location = useLocation();
  const { id, recipeItem } = location.state;

  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [orderedImages, setOrderedImages] = useState([]);
  const [recipe, setRecipe] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const { token } = useGlobalContext();

  const navigate = useNavigate();

  const handleGetRecipe = () => {
    api.recipe(id).then((res) => {
      if (res.status === 200) {
        setRecipe(res.data.recipes);
        console.log(res.data.recipes);
        setOrderedImages(
          res.data.recipes?.images
            ?.slice()
            ?.sort((a, b) => a.order - b.order) || []
        );
      }
    });
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
      handleCheckToken();
    }
  }, [id]);

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

  return (
    <div className="bg-gray-50 h-full py-10 flex flex-col items-center">
      <h2 className="text-gray-800 text-2xl font-bold text-center mb-8 bg-gray-200 w-full py-2">
        {recipe && recipe.name}
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
          recipe.steps.map((item) => {
            return (
              <div key={item.id} className="flex flex-row items-center gap-4">
                <p className="font-medium text-xl">{item.order}</p>
                <div className="w-full px-6 py-2">
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
      </div>

      {recommendedRecipes.length > 0 && (
        <>
          <h4 className="mt-12 font-bold text-2xl text-gray-700 bg-gray-200 w-full text-center py-2">
            Receitas recomendadas
          </h4>
          <div className="relative w-full mt-6 px-4 max-w-screen-lg mx-auto">
            <div className="flex overflow-hidden">
              {/* Contêiner de Slides */}
              <div
                className="flex transition-transform duration-500 ease-in-out gap-4 px-8"
                style={{
                  transform: `translateX(-${
                    (currentIndex / recommendedRecipes.length) * 100
                  }%)`,
                  width: `${recommendedRecipes.length * 100}%`, // Garantir que a largura total seja 100% para todos os itens
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
    </div>
  );
};

export default Recipe;
