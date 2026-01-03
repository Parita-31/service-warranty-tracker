function Navbar({ title }) {
  return (
    <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">{title}</h1>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="bg-red-500 px-3 py-1 rounded text-sm"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
