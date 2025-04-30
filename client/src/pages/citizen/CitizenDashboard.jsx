import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiLocationOn } from "react-icons/ci";

const CitizenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const citizen_token = localStorage.getItem("citizen_token");
  const citizenId = localStorage.getItem("citizenId");
  const citizenName = localStorage.getItem("citizenName");
  const citizenEmail = localStorage.getItem("citizenEmail");

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        "https://smart-complaint-management-system.onrender.com/api/v1/citizen/getComplaints",
        {
          headers: { Authorization: `Bearer ${citizen_token}` },
        }
      );
      setComplaints(res.data.complaint);
      toast.success(res.data.message || "Complaints fetched successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load Complaints");
    }
  };

  const handleUpvote = async (complaintId) => {
    try {
      if (!citizen_token || !citizenId) {
        toast.error("You must be logged in!");
        return;
      }

      const res = await axios.patch(
        "https://smart-complaint-management-system.onrender.com/api/v1/citizen/upvote",
        {
          citizen: citizenId,
          complaint: complaintId,
        },
        {
          headers: {
            Authorization: `Bearer ${citizen_token}`,
          },
        }
      );

      toast.success(res.data.message || "Upvoted successfully!");
      fetchComplaints();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to upvote complaint"
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!citizenId) {
      toast.error("You must be logged in to register an complaint.");
      return;
    }

    if (!title || !desc || !location || !image) {
      toast.warning("All fields including image are required");
      return;
    }

    setIsRegistering(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("location", location);
    formData.append("image", image);

    try {
      const res = await axios.post(
        "https://smart-complaint-management-system.onrender.com/api/v1/citizen/registerComplaint",
        formData,
        {
          headers: {
            Authorization: `Bearer ${citizen_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Complaint registered successfully");
      setShowForm(false);
      setTitle("");
      setDesc("");
      setLocation("");
      setImage(null);
      fetchComplaints();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to register complaint"
      );
    } finally {
      setIsRegistering(false);
    }
  };

  async function getReadableLocation(lat, lon) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();

      const {
        road,
        neighbourhood,
        suburb,
        city,
        town,
        county,
        state,
        postcode,
        country,
      } = data.address;

      const readableLocation = [
        road || neighbourhood || "",
        suburb || "",
        city || town || county || "",
        state || "",
        postcode || "",
        country || "",
      ]
        .filter(Boolean)
        .join(", ");

      return readableLocation || data.display_name || "Unknown location";
    } catch (error) {
      console.error("Error getting location from Nominatim:", error);
      return "Unable to get location";
    }
  }

  const filteredComplaint = complaints.filter(
    (i) => filter === "all" || i.status === filter
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        let secondsLeft = 3;
        const toastId = toast.error(
          `Session expired. Redirecting in ${secondsLeft--}s...`
        );

        const countdown = setInterval(() => {
          if (secondsLeft > 0) {
            toast.loading(`Redirecting in ${secondsLeft--}s...`, {
              id: toastId,
            });
          } else {
            clearInterval(countdown);
            localStorage.removeItem("complaint_token");
            localStorage.removeItem("admin_token");
            toast.dismiss(toastId);
            window.location.href = "/";
          }
        }, 1000);
      }

      return Promise.reject(error);
    }
  );

  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (!citizen_token) {
      toast.error("Access denied. Please login first.");
      window.location.href = "/citizen";
      return;
    }

    if (!hasFetchedRef.current) {
      fetchComplaints();
      hasFetchedRef.current = true;
    }
  }, [citizen_token]);

  return (
    <div className="p-2 sm:p-4 max-w-5xl mx-auto">
      <ToastContainer />
      <div className="sticky top-0 z-50 bg-base-100 border-b shadow-sm py-4 px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-base-content">
          Complaint Dashboard
        </h1>

        <div className="flex items-center gap-4">
          <button
            className="btn btn-primary btn-sm sm:btn-md"
            onClick={() => setShowForm(true)}
          >
            + Register Complaint
          </button>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={`https://ui-avatars.com/api/?name=${citizenName}&background=random`}
                  alt="Profile"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-60"
            >
              <li>
                <span className="font-semibold">{citizenName}</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">{citizenEmail}</span>
              </li>
              <li>
                <button
                  className="text-red-500 font-semibold"
                  onClick={() => {
                    localStorage.removeItem("citizen_token");
                    window.location.href = "/citizen";
                    toast.success("Logged out successfully");
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 px-2 sm:px-4 mb-6 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
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
      ) : filteredComplaint.length === 0 ? (
        <p className="text-center font-semibold">No complaints found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-2 gap-4 sm:gap-6">
          {filteredComplaint.map((complaint) => (
            <div
              key={complaint._id}
              className="card bg-base-100 shadow-md border hover:shadow-lg transition duration-300"
            >
              <figure className="h-40 sm:h-48 overflow-hidden">
                <img
                  src={complaint.image || "/placeholder.svg"}
                  alt="complaint"
                  className="object-cover w-full h-full"
                />
              </figure>
              <div className="card-body p-4 sm:p-6">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-sm sm:text-base text-base-content">
                    {complaint.title}
                  </h2>
                  <div
                    className={`badge badge-xs sm:badge-sm text-white capitalize ${
                      complaint.status === "pending"
                        ? "badge-error"
                        : complaint.status === "in-progress"
                        ? "badge-warning text-black"
                        : "badge-success"
                    }`}
                  >
                    {complaint.status.replace("-", " ")}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-base-content/70">
                  {complaint.description}
                </p>
                <p className="text-xs text-base-content/60 mt-1 flex items-center gap-1">
                  <CiLocationOn className="text-lg text-black dark:text-white" />
                  {complaint.location}
                </p>
                <div className="card-actions justify-between items-center mt-3 sm:mt-4">
                  <button
                    className="btn btn-xs sm:btn-sm btn-outline btn-success gap-1 sm:gap-2"
                    onClick={() => handleUpvote(complaint._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 sm:h-4 sm:w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3 10h4v7a1 1 0 001 1h4a1 1 0 001-1v-7h4l-7-7-7 7z" />
                    </svg>
                    Upvote ({complaint.upvotes.length})
                  </button>
                  <div className="badge badge-outline capitalize text-xs">
                    {complaint.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleRegister}
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
        >
          <div className="bg-base-100 p-4 sm:p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-4 sm:space-y-5 border border-base-300">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-base-content">
              Register New Complaint
            </h2>

            <input
              type="text"
              placeholder="Title"
              className="input input-bordered w-full text-sm sm:text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Description"
              className="textarea textarea-bordered w-full min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />

            <div className="relative w-full">
              <input
                type="text"
                placeholder="Location"
                className="input input-bordered w-full text-sm sm:text-base"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={async () => {
                  if (!navigator.geolocation) {
                    toast.error(
                      "Geolocation is not supported by your browser."
                    );
                    return;
                  }

                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      const { latitude, longitude } = position.coords;

                      const readableLocation = await getReadableLocation(
                        latitude,
                        longitude
                      );

                      setLocation(readableLocation);
                      toast.success("Location fetched successfully!");
                    },
                    (error) => {
                      toast.error("Failed to fetch location.");
                      console.error(error);
                    }
                  );
                }}
                className="absolute right-2 top-2 px-1 py-0.5 text-xs btn btn-xs btn-primary"
              >
                Use My Location
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full text-sm sm:text-base"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-sm sm:btn-md btn-ghost border border-base-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-sm sm:btn-md btn-primary"
                disabled={isRegistering}
              >
                {isRegistering ? "Registering..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CitizenDashboard;
