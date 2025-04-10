import React, { useState } from "react";
import MainInput from "../../components/inputs/mainInput";

const NewRecipes = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  return (
    <div className="bg-gray-50 h-full px-6 py-10">
      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-full p-4">
        <h2 className="text-gray-500 text-xl font-bold pb-2 border-b-3 border-gray-200">
          Criar Receita
        </h2>

        <div className="flex flex-row gap-8">
          <MainInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            type={"text"}
            placeholder={"Nome"}
            classInput={"w-full h-10 !border-gray-400"}
            classDiv={"w-4/12 mt-6 flex items-center"}
            classLabel={"w-full ps-2"}
            label={"Nome"}
            id={"nome"}
          />

          <MainInput
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type={"text"}
            placeholder={"Descrição"}
            classInput={"w-full h-10 !border-gray-400"}
            classDiv={"w-8/12 mt-6 flex items-center"}
            classLabel={"w-full ps-2"}
            label={"Descrição"}
            id={"descrição"}
          />
        </div>
      </div>
    </div>
  );
};

export default NewRecipes;
