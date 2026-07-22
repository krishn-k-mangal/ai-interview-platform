import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../api";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import PageHeader from "../../components/common/PageHeader";

function RecruiterCreateJob() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_skills: "",
    experience: "",
    salary: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post(
        "/jobs/create-job",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Job created successfully");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        required_skills: "",
        experience: "",
        salary: "",
        location: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <RecruiterLayout title="Create Job" breadcrumbs={[{ label: "Jobs", href: "/recruiter-jobs" }, { label: "Create Job" }]}>
      <PageHeader
        title="Create a New Job"
        subtitle="Post a new open position to attract candidates"
      />

      <div className="bg-white p-8 rounded-xl shadow-sm ring-1 ring-black/5">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className={labelClass}>Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="e.g. Senior Frontend Engineer"
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              placeholder="Detailed job description..."
              onChange={handleChange}
              rows={4}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Required Skills</label>
            <input
              type="text"
              name="required_skills"
              value={formData.required_skills}
              placeholder="e.g. React, Node.js, Python (comma separated)"
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                placeholder="e.g. 3-5 Years"
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                placeholder="e.g. Remote, San Francisco"
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Salary (Optional)</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              placeholder="e.g. $120k - $150k"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition shadow-sm ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </RecruiterLayout>
  );
}

export default RecruiterCreateJob;
