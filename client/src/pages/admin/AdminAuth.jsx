import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://smart-complaint-management-system.onrender.com/api/v1/admin/login",
        {
          email,
          password,
        }
      );
      const { token, citizen } = response.data;
      if (token && citizen) {
        localStorage.setItem("admin_token", token);
        localStorage.setItem("adminName", citizen.name);
        localStorage.setItem("adminEmail", citizen.email);
        toast.success("Login successful");
        navigate("/admin/dashboard");
      } else {
        throw new Error("Token not received");
      }
    } catch (error) {
      toast.error("Invalid credentials! Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url('https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp')",
      }}
    >
      <Toaster position="top-center" />
      <div className="bg-black/60 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-3 mb-6 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />

        <button
          onClick={handleSubmit}
          className="btn btn-primary w-full rounded-lg"
          disabled={isSubmitting || !email || !password}
        >
          Login
        </button>
        <div className="flex justify-center mt-4">
          <button
            className="text-blue-400 font-semibold hover:underline"
            onClick={() => navigate("/reset-password")}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
