import { useEffect, useState } from "react";
import API from "../../api";
import CandidateLayout from "../../layouts/CandidateLayout";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import SkillBadge from "../../components/candidate/SkillBadge";
import { Link } from "react-router-dom";
import EditProfileModal from "../../components/common/EditProfileModal";
import toast from "react-hot-toast";

function CandidateProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext, setUserContext] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/candidate/my-profile");
      if (res.data && !res.data.message) {
        setProfileData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserContext(payload);
      } catch (e) {
        console.error("Failed to decode token");
      }
    }
    fetchProfile();
  }, []);

  const handleSaveProfile = async (formData) => {
    setSaving(true);
    try {
      await API.put("/candidate/update-profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Profile updated successfully");
      setIsEditModalOpen(false);
      
      // Refresh the token data if we had a way, but for now just refresh profile
      await fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  const getInitials = (name) => {
    if (!name) return "C";
    return name.charAt(0).toUpperCase();
  };

  const skills = profileData?.skills ? profileData.skills.split(",").filter(Boolean) : [];

  return (
    <CandidateLayout title="My Profile" breadcrumbs={[{ label: "Profile" }]}>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information, resume, and skills"
      >
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm">
            Change Password
          </button>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
          >
            Edit Profile
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Personal Information */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>
            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 border border-blue-100 shadow-sm">
                  {getInitials(profileData?.name || userContext?.name)}
                </div>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition">Change Avatar</button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    {profileData?.name || userContext?.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    {profileData?.email || userContext?.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    {profileData?.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Location</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    {profileData?.location || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Professional Information */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Professional Information</h2>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Education</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    {profileData?.education || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Experience</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    {profileData?.experience || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Resume & Skills */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Resume & Skills</h2>
            </div>
            <div className="p-4 md:p-6">
              
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Resume Upload Date</label>
                <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 max-w-xs">
                  {profileData?.resume_date ? new Date(profileData.resume_date).toLocaleDateString() : "Not provided"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <SkillBadge key={index} text={skill.trim()} color="blue" />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills detected. Upload a resume.</p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column (Scores & Activity) */}
        <div className="space-y-6">
          
          {/* 4. Scores */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Scores</h2>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-gray-600">Resume Score</span>
                  <span className="text-sm font-bold text-gray-900">{profileData?.resume_score || 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${profileData?.resume_score || 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-gray-600">Average Test Score</span>
                  <span className="text-sm font-bold text-gray-900">{profileData?.average_test_score?.toFixed(1) || 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${profileData?.average_test_score || 0}%` }}></div>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-100 mt-2">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold text-gray-900">Average Final Score</span>
                  <span className="text-xl font-bold text-green-600">{profileData?.average_final_score?.toFixed(1) || 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${profileData?.average_final_score || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Activity Summary */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-5">Activity Summary</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <span className="block text-2xl font-bold text-gray-900 mb-1">{profileData?.status ? "1" : "0"}</span>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Applications</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Status</span>
                <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase ${
                  profileData?.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                  profileData?.status ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {profileData?.status || "None"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/my-applications">
                <button className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm">
                  View My Applications
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={profileData}
        loading={saving}
      />
    </CandidateLayout>
  );
}

export default CandidateProfile;
