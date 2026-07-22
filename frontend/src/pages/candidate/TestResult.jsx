
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import CandidateLayout from "../../layouts/CandidateLayout";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import DashboardCard from "../../components/common/DashboardCard";
function TestResult() {
    const { application_id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    useEffect(() => {
        API.get(`/test/result/${application_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setResult(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [application_id, token]);
    if (loading) {
        return <Loader text="Loading results..." />;
    }
    if (!result) {
        return (
            <CandidateLayout>
                <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-8 text-center">
                    <p className="text-gray-500">Test results not found.</p>
                </div>
            </CandidateLayout>
        );
    }
    const getStatusStyle = (status) => {
        if (!status) return "bg-gray-100 text-gray-700";
        if (status === "SELECTED") return "bg-green-100 text-green-700";
        if (status === "REJECTED") return "bg-red-100 text-red-700";
        if (status === "INTERVIEW_SCHEDULED") return "bg-blue-100 text-blue-700";
        return "bg-yellow-100 text-yellow-700";
    };
    return (
        <CandidateLayout
            title="Test Results"
            breadcrumbs={[
                { label: "My Applications", href: "/my-applications" },
                { label: "Test Results" },
            ]}
        >
            <PageHeader
                title="Test Results"
                subtitle={`Evaluation summary for ${result.job_title}`}
            >
                <button
                    onClick={() => navigate("/my-applications")}
                    className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
                >
                    Back to Applications
                </button>
            </PageHeader>
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{result.job_title}</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Final evaluation and screening scores
                        </p>
                    </div>
                    <div className="shrink-0">
                        <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(
                                result.status
                            )}`}
                        >
                            {result.status?.replaceAll("_", " ")}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6 ring-1 ring-black/5 text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Resume Score
                        </p>
                        <h3 className="text-3xl font-bold text-blue-600">{result.resume_score}</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 ring-1 ring-black/5 text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Match Score
                        </p>
                        <h3 className="text-3xl font-bold text-green-600">
                            {Number(result.match_score).toFixed(1)}%
                        </h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 ring-1 ring-black/5 text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Test Score
                        </p>
                        <h3 className="text-3xl font-bold text-yellow-600">{Number(result.test_score || 0).toFixed(1)}%</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 ring-1 ring-black/5 text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Final Score
                        </p>
                        <h3 className="text-3xl font-bold text-purple-600">{Number(result.final_score || 0).toFixed(1)}%</h3>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}

export default TestResult;
