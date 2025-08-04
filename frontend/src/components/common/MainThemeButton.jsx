const MainThemeButton = ({ loading, width, page, type }) => (
  <div>
    <button
      type={type}
      className={`${width} bg-teal-700 text-white py-3 rounded-md hover:bg-teal-800 transition-colors font-medium`}
      style={{ backgroundColor: "#266b7d" }}
    >
      {loading ? "loading" : `${page}`}
    </button>
  </div>
);

export default MainThemeButton;
