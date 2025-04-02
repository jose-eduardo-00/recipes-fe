const MainInput = ({
  value,
  onChange,
  type,
  placeholder,
  classDiv,
  classInput,
  classLabel,
  label,
  id,
}) => {
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
      <input
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={`border-2 border-black rounded-lg ps-2 ${classInput}`}
      />
    </div>
  );
};

export default MainInput;
