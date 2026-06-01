import { useState } from "react";
import RecruiterSidebar from "../components/RecruiterSidebar";

import API from "../api";

function RucruiterCreateJob() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",

    description: "",

    required_skills: "",

    experience: "",

    salary: "",

    location: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/jobs/create-job",

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Job created successfully ✅");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <RecruiterSidebar />

      {/* Main Content */}
      <div className="ml-64 w-full p-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow max-w-2xl mx-auto space-y-4"
        >
          <h1 className="text-3xl font-bold mb-6">Create Job 🚀</h1>

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="required_skills"
            placeholder="Required Skills"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="experience"
            placeholder="Experience"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
          >
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default RucruiterCreateJob;
