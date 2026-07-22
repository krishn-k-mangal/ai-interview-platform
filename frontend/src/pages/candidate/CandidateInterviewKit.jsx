import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api";
import CandidateLayout from "../../layouts/CandidateLayout";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";

export default function CandidateInterviewKit() {
  const { applicationId } = useParams();
  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const res = await API.get(`/ai/candidate/interview-kit/${applicationId}`);
        setKit(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchKit();
  }, [applicationId]);

  if (loading) {
    return <Loader text="Loading Interview Kit..." />;
  }

  if (!kit) {
    return (
      <CandidateLayout title="Interview Kit">
        <PageHeader title="Interview Kit" subtitle="Preparation materials for your interview" />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Interview Kit Not Available</h2>
          <p className="text-gray-500 max-w-md mx-auto">Your recruiter hasn't generated your interview kit yet. Please check back closer to your interview date.</p>
          <div className="mt-6">
            <Link to="/my-applications">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition shadow-sm">
                Back to Applications
              </button>
            </Link>
          </div>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout
      title="Interview Kit"
      breadcrumbs={[
        { label: "My Applications", href: "/my-applications" },
        { label: "Interview Kit" }
      ]}
    >
      <PageHeader
        title="Your Interview Kit"
        subtitle="Review your customized preparation materials"
      />

      <div className="space-y-6">
        {/* Candidate Summary */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Candidate Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm">{kit.candidate_summary}</p>
        </div>

        {/* Strengths and Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 border-t-4 border-t-green-500">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Key Strengths
            </h2>
            <ul className="space-y-3">
              {kit.strengths.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 border-t-4 border-t-red-500">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Areas for Improvement
            </h2>
            <ul className="space-y-3">
              {kit.weaknesses.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Practice Questions */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Suggested Practice Questions
          </h2>

          <div className="space-y-4">
            {kit.questions.map((q, index) => (
              <div key={index} className="border border-gray-100 bg-gray-50 rounded-lg p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {q.skill}
                  </span>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    q.difficulty.toLowerCase() === 'hard' ? 'text-red-600' :
                    q.difficulty.toLowerCase() === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{q.question}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </CandidateLayout>
  );
}
