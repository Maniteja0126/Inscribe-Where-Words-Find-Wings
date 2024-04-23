import { Menu } from "./index";
import { Link } from "react-router-dom";

export const Appbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b flex justify-between px-10 py-4 mb-10 backdrop-blur-lg">
      <Link
        to={"/blogs"}
        className="flex flex-col justify-center cursor-pointer text-white text-xl"
      >
        {" "}
        <div className="flex">
          <img src="logo.png" alt="" width={30} />
          Inscribe
        </div>
      </Link>
      <div>
        <Link to={"/publish"}>
          <button
            type="button"
            className="text-white hover:text-white border border-white hover:bg-black font-medium rounded-2xl text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            New
          </button>
        </Link>
        <Menu />
      </div>
    </div>
  );
};
