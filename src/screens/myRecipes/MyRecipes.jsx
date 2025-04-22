import React, { useEffect, useState } from "react";
import api from "../../services/api/recipe/index";
import { useGlobalContext } from "../../context/context";
import { jwtDecode } from "jwt-decode";
import MainButton from "../../components/buttons/mainButton";
import { baseUrl } from "../../services/config";
import CamIcon from "../../../assets/icons/camIcon.svg";
import MainInput from "../../components/inputs/mainInput";
import { useNavigate } from "react-router-dom";

const MyRecipes = () => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState(null);

  const [nameRecipe, setNameRecipe] = useState("");

  const navigate = useNavigate();

  const { token } = useGlobalContext();

  const getMyRecipes = (id) => {
    api.myRecipes(id).then((res) => {
      console.log(res.status, res.data.recipes);
      if (res.status === 200) {
        setRecipes(res.data.recipes);

        setFilteredRecipes(res.data.recipes);
      }
    });
  };

  const handleCheckToken = () => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      getMyRecipes(decoded.id);
    }
  };

  useEffect(() => {
    if (token) {
      handleCheckToken();
    }
  }, [token]);

  const handleCriarReceita = () => {
    navigate("new-recipes");
  };

  const handleRecipe = (item) => {
    console.log(item);

    navigate("../recipe", { state: { recipe: item } });
  };

  const handleFilterRecipes = (item) => {
    const filtered = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(item.toLowerCase())
    );

    setFilteredRecipes(filtered);
  };

  const handleIngredienteChange = (item) => {
    setNameRecipe(item);

    handleFilterRecipes(item);
  };

  return (
    <div className="bg-gray-50 h-full px-6 py-10">
      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-full px-4 py-6 min-h-[70vh]">
        <h2 className="text-gray-500 text-xl font-bold pb-2 border-b-3 mb-4 border-gray-200">
          Minhas Receitas
        </h2>

        <div className="flex flex-row min-h-[60vh]">
          <div className="w-2/8 border-r-2 border-gray-300">
            <h2 className="font-bold mb-4 text-gray-500">Filtros</h2>
            <MainInput
              value={nameRecipe}
              onChange={(e) => handleIngredienteChange(e.target.value)}
              type={"text"}
              placeholder={"nome"}
              classInput={"w-full h-8 !border-gray-400 text-sm"}
              classDiv={"w-11/12 flex items-center"}
              id="nameRecipe"
            />
          </div>
          {filteredRecipes == null ? (
            <div className="flex flex-col items-center w-full">
              <p className="font-medium mb-3">
                Você não possui nenhum receita salva.
              </p>

              <MainButton
                classButton={
                  "bg-black w-40 text-white !py-2.5 hover:bg-gray-800 transition"
                }
                classDiv={"mt-2"}
                onClick={handleCriarReceita}
                isLoading={isLoadingCreate}
                text={"Criar Receita"}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4 px-10 w-full">
              <div className="flex flex-row gap-8">
                {filteredRecipes.length === 0 && nameRecipe.trim() !== "" && (
                  <p className="text-center text-gray-500 font-medium pt-8">
                    Nenhuma receita encontrada.
                  </p>
                )}

                {filteredRecipes.map((item) => {
                  return (
                    <div
                      className="flex flex-col items-center gap-2 transition duration-300 hover:brightness-50 cursor-pointer"
                      onClick={() => handleRecipe(item)}
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
                      <h4 className="w-20 text-center font-medium">
                        {item.name}
                      </h4>
                    </div>
                  );
                })}
              </div>
              {filteredRecipes.length > 20 && (
                <MainButton
                  classButton={
                    "bg-black w-30 !h-10 text-white !py-2.5 hover:bg-gray-800 transition"
                  }
                  classDiv={"mt-4"}
                  onClick={handleCriarReceita}
                  isLoading={isLoadingCreate}
                  text={"Ver mais"}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;
