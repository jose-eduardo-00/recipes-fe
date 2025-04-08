import React from "react";

const alertStyles = {
  success: {
    bg: "bg-green-100",
    border: "border-green-400",
    text: "text-green-700",
  },
  error: {
    bg: "bg-red-100",
    border: "border-red-400",
    text: "text-red-700",
  },
  warning: {
    bg: "bg-yellow-100",
    border: "border-yellow-400",
    text: "text-yellow-700",
  },
  info: {
    bg: "bg-blue-100",
    border: "border-blue-400",
    text: "text-blue-700",
  },
};

const MainAlert = ({ type, message = "", title }) => {
  const style = alertStyles[type] || alertStyles.info;

  return (
    <div
      className={`${style.bg} ${style.border} ${style.text} px-4 py-3 rounded relative`}
      role="alert"
    >
      <strong className="font-bold capitalize">{title}!</strong>{" "}
      <span className="block sm:inline">{message}</span>
      {/* {onClose && (
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <button className={`${style.text}`} onClick={onClose}>
            <svg
              className="fill-current h-6 w-6"
              role="button"
              viewBox="0 0 20 20"
            >
              <title>Fechar</title>
              <path d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652A1 1 0 105.652 7.066L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z" />
            </svg>
          </button>
        </span>
      )} */}
    </div>
  );
};

export default MainAlert;
