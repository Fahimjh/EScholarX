import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data));
  }, []);

  const startPayment = async (courseId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await api.post("/payments/create-session", { courseId });
      const redirectUrl = res.data?.url as string | undefined;

      if (!redirectUrl) {
        alert("Failed to start payment. Please try again.");
        return;
      }

      window.location.href = redirectUrl;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to start payment. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="p-6 grid gap-4">
      {courses.map((c) => (
        <div key={c._id} className="border rounded p-4 space-y-2">
          <h3 className="font-semibold text-lg">{c.title}</h3>
          <p className="text-sm text-gray-600">{c.description}</p>
          <button
            onClick={() => startPayment(c._id)}
            className="bg-blue-600 text-white text-sm rounded px-3 py-1 mt-2"
          >
            {user ? "Pay & Enroll" : "Login to enroll"}
          </button>
        </div>
      ))}
    </div>
  );
}
