import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../services/config";
import CamIcon from "../../../assets/icons/camIcon.svg";
import api from "../../services/api/recipe/index";
import { useGlobalContext } from "../../context/context";
import { jwtDecode } from "jwt-decode";

const Recipe = () => {
  const location = useLocation();
  const { id, recipeItem } = location.state;

  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [recipe, setRecipe] = useState(null);

  const { token } = useGlobalContext();

  const navigate = useNavigate();

  const handleGetRecipe = () => {
    api.recipe(id).then((res) => {
      if (res.status === 200) {
        setRecipe(res.data.recipes);
      }
    });
  };

  const handleRecommendedRecipes = (id, recipeId) => {
    api.recommendedRecipes(recipeItem.userId, id, recipeId).then((res) => {
      if (res.status === 200) {
        setRecommendedRecipes(res.data.recipes);
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

  return (
    <div className="bg-gray-50 h-full py-10 flex flex-col items-center">
      <h2 className="text-gray-800 text-2xl font-bold text-center mb-8 bg-gray-200 w-full py-2">
        {recipe && recipe.name}
      </h2>
      {recipe && recipe.images.length > 0 ? (
        <img
          src={`${baseUrl}${recipe.images[0].imageUrl}`}
          alt="Foto da receita"
          className="w-200 h-100 rounded-2xl"
        />
      ) : (
        <div className="w-200 h-80 rounded-2xl bg-gray-400 flex items-center justify-center">
          <img src={CamIcon} className="w-10 h-10" alt="" />
        </div>
      )}

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
      <div className="flex flex-row justify-evenly w-full mt-4">
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
                <div className="border-2 border-gray-200 w-full px-6 py-4 rounded-md bg-white">
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
          <div className="flex flex-row justify-center gap-4 px-10 mt-6 w-full">
            {recommendedRecipes.map((item) => {
              return (
                <div
                  className="flex flex-col items-center gap-2 transition duration-300 hover:brightness-50 cursor-pointer"
                  onClick={() => handleRecipe(item)}
                  key={item.id}
                >
                  {item.images.length > 0 ? (
                    <img
                      src={`${baseUrl}${item.images[0].imageUrl}`}
                      className="w-35 h-35 rounded-2xl"
                      alt=""
                    />
                  ) : (
                    <div className="w-35 h-35 rounded-2xl bg-gray-400 flex items-center justify-center">
                      <img src={CamIcon} className="w-10 h-10" alt="" />
                    </div>
                  )}
                  <h4 className="w-20 text-center font-medium">{item.name}</h4>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Recipe;
