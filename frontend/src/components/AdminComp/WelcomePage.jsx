import { useAppContext } from "../../context/AppConext";

const WelcomePage = () => {
  const { navigate } = useAppContext();

  return (
    <div className="bg-[#000F19] w-full h-screen flex flex-col justify-center items-center px-4">
      <img
        className="w-2/3 max-w-xs sm:w-1/2 sm:max-w-md md:w-1/3 md:max-w-lg mb-8"
        src="/welcomePage.png"
        alt="Welcome"
      />
      <button
        onClick={() => navigate("/login")}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full max-w-xs sm:w-1/2 sm:max-w-sm md:w-1/4 md:max-w-md font-bold py-2 px-4 rounded block"
      >
        Get Started
      </button>
    </div>
  );
};

export default WelcomePage;
