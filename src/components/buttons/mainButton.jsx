const MainButton = ({
  onClick,
  text,
  isLoading,
  classDiv,
  classButton,
  classSpinner,
}) => {
  return (
    <div className={`flex justify-center ${classDiv}`}>
      <button
        onClick={onClick}
        className={`px-4 py-2 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${classButton} cursor-pointer`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div
            className={`w-5 h-5 border-2 ${classSpinner} border-t-transparent rounded-full animate-spin`}
          ></div>
        ) : (
          text
        )}
      </button>
    </div>
  );
};

export default MainButton;
