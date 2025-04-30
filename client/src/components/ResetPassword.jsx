import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email || !newPassword) {
      return toast.error("Please provide both email and new password.");
    }

    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        "http://localhost:5000/api/v1/common/resetPassword",
        {
          email,
          newPassword,
        }
      );
      toast.success(response.data.message || "Password updated successfully.");
      setEmail("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // This will navigate back to the previous page
          className="mb-4 text-white font-semibold hover:underline"
        >
          &#8592; Back
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
          Reset Password
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
          placeholder="New password"
          className="w-full p-3 mb-4 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isSubmitting}
        />

        <button
          onClick={handleResetPassword}
          className="btn btn-primary w-full rounded-lg"
          disabled={isSubmitting || !email || !newPassword}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
