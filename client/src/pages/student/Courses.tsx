import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data));
  }, []);

  const goToFirstLesson = async (courseId: string) => {
    const res = await api.get(`/lessons/by-course/${courseId}`);
    const lessons = res.data;
    if (!lessons || lessons.length === 0) {
      alert("No lessons available for this course yet.");
      return;
    }

    const firstLesson = lessons[0];
    navigate(`/course/${courseId}/lesson/${firstLesson._id}`);
  };

  const enrollAndStart = async (courseId: string) => {
    await api.post("/enrollments", { courseId });
    await goToFirstLesson(courseId);
  };

  return (
    <div className="p-6 grid gap-4">
      {courses.map((c) => (
        <div key={c._id} className="border rounded p-4 space-y-2">
          <h3 className="font-semibold text-lg">{c.title}</h3>
          <p className="text-sm text-gray-600">{c.description}</p>
          <button
            onClick={() => enrollAndStart(c._id)}
            className="bg-blue-600 text-white text-sm rounded px-3 py-1 mt-2"
          >
            Enroll &amp; Start
          </button>
        </div>
      ))}
    </div>
  );
}
