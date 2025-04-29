import React from "react";
import MainButton from "../buttons/mainButton";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  classCard,
  isLoading,
  handleSaveEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className={`bg-white rounded-2xl shadow-xl w-full max-w-md ${classCard} p-6 z-50 relative transform transition-all scale-95 animate-fade-in`}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
          <div className="mb-4">{children}</div>

          <div className="flex flex-row justify-end gap-4">
            <MainButton
              classButton={"bg-gray-200 !text-black  w-30 text-white !py-2.5"}
              classDiv={"justify-end mt-2"}
              onClick={onClose}
              text={"Fechar"}
            />

            <MainButton
              classButton={"bg-black w-50 text-white !py-2.5"}
              classDiv={"justify-end mt-2"}
              onClick={handleSaveEdit}
              isLoading={isLoading}
              text={"Salvar Alterações"}
            />
          </div>
          {/* <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Fechar
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Modal;
