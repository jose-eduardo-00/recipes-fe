const MainSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Selecione uma opção",
  label,
  id,
  classDiv = "",
  classSelect = "",
  classLabel = "",
}) => {
  if (options == null) {
    options = [];
  }

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedItem = options.find((opt) => opt.value === selectedValue);
    onChange(selectedItem); // envia o objeto completo
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
      <select
        id={id}
        value={value}
        onChange={handleChange}
        className={`border-2 border-black rounded-lg px-2 py-1 ${classSelect}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MainSelect;
