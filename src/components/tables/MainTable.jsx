import React, { useState, useEffect } from "react";
import MainButton from "../../components/buttons/mainButton"; // Certifique-se de ter esse componente disponível

const MainTable = ({ columns, data, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(data?.slice(startIndex, endIndex));
  }, [currentPage, data, itemsPerPage]);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="table-auto w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="text-left text-gray-600 font-semibold px-4 py-2 border-b"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col, colIdx) => {
                if (col.type === "buttons" && Array.isArray(col.buttons)) {
                  return (
                    <td key={colIdx} className="px-4 py-2 border-b space-x-2">
                      {col.buttons.map((btn, btnIdx) => {
                        // Mostrar "ban" se não ativado
                        if (btn.name === "ban" && !item.activated) return null;

                        // Mostrar "check" se já ativado
                        if (btn.name === "check" && item.activated) return null;

                        return (
                          <button
                            key={btnIdx}
                            onClick={() => btn.onClick(item)}
                            className={`hover:scale-105 transition-transform cursor-pointer px-2 py-1 rounded-xl ${btn.colorButton}`}
                          >
                            {btn.icon}
                          </button>
                        );
                      })}
                    </td>
                  );
                } else {
                  return (
                    <td key={colIdx} className={` py-4 border-b`}>
                      <span
                        className={`py-2 px-4 rounded-xl ${
                          col.field === "activated"
                            ? item[col.field]
                              ? "bg-emerald-500 text-white"
                              : "bg-red-500 text-white"
                            : ""
                        }`}
                      >
                        {col.field === "activated"
                          ? item[col.field]
                            ? "Ativo"
                            : "Inativo"
                          : item[col.field]}
                      </span>
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      {totalPages >= 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <MainButton
            classButton={`w-30 text-white ${
              currentPage === 1 ? "bg-gray-300" : "bg-black"
            }`}
            onClick={() => changePage(currentPage - 1)}
            text={"Anterior"}
            disabled={currentPage === 1}
          />
          <span className="text-sm">
            {currentPage} de {totalPages}
          </span>
          <MainButton
            classButton={`w-30 text-white ${
              currentPage === totalPages ? "bg-gray-300" : "bg-black"
            }`}
            onClick={() => changePage(currentPage + 1)}
            text={"Próximo"}
            disabled={currentPage === totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default MainTable;
