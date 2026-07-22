import { useEffect, useState } from "react";
import API from "../../api";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EditProfileModal from "../../components/common/EditProfileModal";
import toast from "react-hot-toast";

function RecruiterProfile() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext, setUserContext] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProfileAndAnalytics = async () => {
    try {
      const [analyticsRes, profileRes] = await Promise.all([
        API.get("/jobs/analytics"),
        API.get("/recruiter/my-profile")
      ]);
      
      if (analyticsRes.data) {
        setAnalyticsData(analyticsRes.data);
      }
      if (profileRes.data) {
        setProfileData(profileRes.data);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
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
    fetchProfileAndAnalytics();
  }, []);

  const handleSaveProfile = async (formData) => {
    setSaving(true);
    try {
      await API.put("/recruiter/update-profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Profile updated successfully");
      setIsEditModalOpen(false);
      await fetchProfileAndAnalytics();
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
    if (!name) return "R";
    return name.charAt(0).toUpperCase();
  };

  return (
    <RecruiterLayout title="My Profile" breadcrumbs={[{ label: "Profile" }]}>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal and company information"
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

          {/* 2. Company Information */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Company Information</h2>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Company Name</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    {profileData?.company || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Designation</label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    {profileData?.designation || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Statistics) */}
        <div className="space-y-6">
          
          {/* 3. Recruiter Statistics */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-5">Recruiter Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <span className="block text-2xl font-bold text-gray-900 mb-1">{analyticsData?.total_jobs || 0}</span>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Jobs Posted</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <span className="block text-2xl font-bold text-gray-900 mb-1">{analyticsData?.applied || 0}</span>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Reviewed</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center col-span-2">
                <span className="block text-2xl font-bold text-purple-600 mb-1">{analyticsData?.interview_scheduled || 0}</span>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Interviews Scheduled</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={profileData}
        isRecruiter={true}
        loading={saving}
      />
    </RecruiterLayout>
  );
}

export default RecruiterProfile;
