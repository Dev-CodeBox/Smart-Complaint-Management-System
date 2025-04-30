import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const CitizenAuth = () => {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/v1/citizen",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  useEffect(() => {
    if (getToken()) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [getToken()]);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Enter your email first");
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/sendOtp", { email });
      toast.success("OTP sent successfully");
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter the OTP");
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/verifyOtp", { email, otp });
      if (res.status === 200) {
        toast.success("OTP verified successfully");
        setIsVerified(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const apiEndpoint = isLogin ? "/login" : "/signup";
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await axiosInstance.post(apiEndpoint, payload);
      if (isLogin) {
        const { token, citizen } = res.data;
        localStorage.setItem("citizen_token", token);
        localStorage.setItem("citizenId", citizen._id);
        localStorage.setItem("citizenName", citizen.name);
        localStorage.setItem("citizenEmail", citizen.email);
        toast.success("Login successful");
        navigate("/citizen/dashboard");
      } else {
        toast.success(res.data.message || "Citizen registered successfully");
        setIsLogin(true);
        setIsVerified(false);
        setOtpSent(false);
        setEmail("");
        setPassword("");
        setName("");
        setOtp("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center px-4 "
      style={{
        backgroundImage:
          "url('https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp')",
      }}
    >
      <Toaster position="top-center" />

      <div className="bg-black/60 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />

        {!isLogin && (
          <>
            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                className="btn btn-primary w-full mb-4 rounded-lg"
                disabled={isSubmitting || !email}
              >
                Send OTP
              </button>
            ) : !isVerified ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full p-3 mb-3 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  onClick={handleVerifyOtp}
                  className="btn btn-success w-full mb-4 rounded-lg"
                  disabled={isSubmitting || !otp}
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-3 mb-4 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
                <input
                  type="password"
                  placeholder="Create password"
                  className="w-full p-3 mb-6 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary w-full rounded-lg"
                  disabled={isSubmitting || !name || !password}
                >
                  Sign Up
                </button>
              </>
            )}
          </>
        )}

        {isLogin && (
          <>
            <input
              type="password"
              placeholder="Password"
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
          </>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-200">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-blue-400 font-semibold hover:underline"
              onClick={() => {
                setIsLogin(!isLogin);
                setOtp("");
                setIsVerified(false);
                setOtpSent(false);
              }}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
          {isLogin && (
            <p className="text-sm text-gray-200 mt-2">
              <button
                className="text-blue-400 font-semibold hover:underline"
                onClick={() => navigate("/reset-password")}
              >
                Forgot Password?
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenAuth;
