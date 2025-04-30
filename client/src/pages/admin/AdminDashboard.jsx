import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiLocationOn } from "react-icons/ci";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  const admin_token = localStorage.getItem("admin_token");
  const adminName = localStorage.getItem("adminName");
  const adminEmail = localStorage.getItem("adminEmail");

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/admin/getComplaints",
        {
          headers: { Authorization: `Bearer ${admin_token}` },
        }
      );
      setComplaints(res.data.complaint);
      toast.success(res.data.message || "Complaints fetched successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load Complaints");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (complaintId, action) => {
    try {
      const endpoint = `http://localhost:5000/api/v1/admin/complaint/${complaintId}/${action}`;
      const res = await axios.patch(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${admin_token}`,
          },
        }
      );
      toast.success(res.data.message);
      fetchComplaints();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        let secondsLeft = 3;
        const toastId = toast.error(
          `Session expired. Redirecting in ${secondsLeft}s...`
        );
        const countdown = setInterval(() => {
          if (secondsLeft > 1) {
            secondsLeft--;
            toast.update(toastId, {
              render: `Session expired. Redirecting in ${secondsLeft}s...`,
              type: toast.TYPE.ERROR,
              isLoading: true,
            });
          } else {
            clearInterval(countdown);
            toast.dismiss(toastId);
            localStorage.removeItem("admin_token");
            window.location.href = "/admin";
          }
        }, 1000);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchComplaints();
      hasFetchedRef.current = true;
    }
  }, []);

  const filteredComplaints = complaints.filter(
    (c) => filter === "all" || c.status === filter
  );

  return (
    <div className="p-2 sm:p-4 max-w-5xl mx-auto">
      <ToastContainer position="top-right" />

      <div className="sticky top-0 z-50 bg-base-100 border-b shadow-sm py-3 sm:py-4 px-3 sm:px-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-base-content">
          Admin Dashboard
        </h1>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-8 sm:w-10 rounded-full">
              <img
                src={`https://ui-avatars.com/api/?name=${adminName}&background=random`}
                alt="Profile"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-60"
          >
            <li>
              <span className="font-semibold">{adminName}</span>
            </li>
            <li>
              <span className="text-sm text-gray-500">{adminEmail}</span>
            </li>
            <li>
              <button
                className="text-red-500 font-semibold"
                onClick={() => {
                  localStorage.removeItem("admin_token");
                  window.location.href = "/admin";
                  toast.success("Logged out successfully");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 px-2 sm:px-4 mb-4 sm:mb-6 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
        {["all", "pending", "in-progress", "resolved"].map((status) => {
          const baseClass = "btn btn-xs sm:btn-sm rounded-full";
          const isActive = filter === status;

          const statusClass = {
            all: isActive ? "btn-primary text-white" : "btn-outline",
            pending: isActive
              ? "btn-error text-white"
              : "btn-outline text-error",
            "in-progress": isActive
              ? "btn-warning text-white"
              : "btn-outline text-warning",
            resolved: isActive
              ? "btn-success text-white"
              : "btn-outline text-success",
          };

          return (
            <button
              key={status}
              className={`${baseClass} ${statusClass[status]}`}
              onClick={() => setFilter(status)}
            >
              {status.replace("-", " ").toUpperCase()}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-center font-semibold">Loading complaints...</p>
      ) : filteredComplaints.length === 0 ? (
        <p className="text-center font-semibold">No complaints found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-2 gap-3 sm:gap-6">
          {filteredComplaints.map((c) => (
            <div
              key={c._id}
              className="card bg-base-100 shadow-md border hover:shadow-lg transition duration-300"
            >
              <figure className="h-40 sm:h-48 overflow-hidden">
                <img
                  src={c.image || "/placeholder.svg"}
                  alt="complaint"
                  className="object-cover w-full h-full"
                />
              </figure>
              <div className="card-body p-3 sm:p-6">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-sm sm:text-base text-base-content">
                    {c.title}
                  </h2>
                  <div
                    className={`badge badge-xs sm:badge-sm capitalize text-white ${
                      c.status === "pending"
                        ? "badge-error"
                        : c.status === "in-progress"
                        ? "badge-warning text-black"
                        : "badge-success"
                    }`}
                  >
                    {c.status.replace("-", " ")}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-base-content/70">
                  {c.description}
                </p>
                <p className="text-xs text-base-content/60 mt-1 flex items-center gap-1">
                  <CiLocationOn className="text-lg text-black dark:text-white" />
                  {c.location}
                </p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 gap-2 sm:gap-0">
                  <div className="flex gap-2">
                    <button
                      className="btn btn-warning btn-xs sm:btn-sm"
                      onClick={() => updateStatus(c._id, "in-progress")}
                    >
                      In-Progress
                    </button>
                    <button
                      className="btn btn-success btn-xs sm:btn-sm"
                      onClick={() => updateStatus(c._id, "resolve")}
                    >
                      Resolve
                    </button>
                  </div>
                  <span className="badge badge-outline text-xs capitalize">
                    {c.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
