import { useState } from "react";
import Eye from "../../../assets/icons/eye.svg";
import EyeClosed from "../../../assets/icons/closedEye.svg";

const MainInput = ({
  value,
  onChange,
  type,
  placeholder,
  classDiv,
  classInput,
  classLabel,
  classIcon,
  label,
  id,
  onKeyDown,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const isTextarea = type === "textarea";

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`flex flex-col ${classDiv}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-gray-700 font-medium mb-1 ${classLabel}`}
        >
          {label}
        </label>
      )}
      <div className={`w-full relative flex  justify-center`}>
        {isTextarea ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`border-2 border-black rounded-lg ps-2 pt-2 resize-none ${classInput}`}
            onKeyDown={onKeyDown}
          />
        ) : (
          <input
            id={id}
            value={value}
            onChange={onChange}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            className={`border-2 border-black rounded-lg ps-2 !align-top ${
              isPassword ? "pe-7" : ""
            }  ${classInput}`}
            onKeyDown={onKeyDown}
          />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 !w-1/12 !h-1/2 ${classIcon}`}
          >
            {showPassword ? (
              <img src={Eye} alt="mostrar senha" />
            ) : (
              <img src={EyeClosed} alt="ocultar senha" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MainInput;
