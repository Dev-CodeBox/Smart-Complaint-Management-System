import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero min-h-screen relative ">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      ></div>

      <div className="hero-content hero-overlay max-w-[1600px]"></div>

      <div className="hero-content text-center opacity-80 text-neutral-content relative z-10">
        <div className="max-w-xl p-6 bg-base-100 bg-opacity-30 bg- rounded-2xl shadow-lg">
          <h1 className="mb-4 text-4xl sm:text-5xl font-extrabold dark:text-white text-black">
            Smart Complaint Management System
          </h1>
          <p className="mb-6 text-sm sm:text-base dark:text-white text-black">
            Smart solution for smart cities
          </p>
          <p className="mb-6 text-sm sm:text-base dark:text-white text-black">
            Click below to proceed as a citizen or an admin.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              className="btn btn-primary px-6"
              onClick={() => navigate("/citizen")}
            >
              Citizen
            </button>
            <button
              className="btn btn-secondary px-6"
              onClick={() => navigate("/admin")}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
