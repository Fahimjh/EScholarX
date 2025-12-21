import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

interface CourseCard {
  id: string; // progress id
  courseId: string | null;
  title: string;
  progressPercent: number;
}

const Dashboard = () => {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [walletBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await api.get("/progress/my");
      const items: CourseCard[] = res.data.map((p: any) => ({
        id: p._id,
        courseId: p.course?._id ?? null,
        title: p.course?.title ?? "Untitled course",
        progressPercent:
          p.totalLessons > 0
            ? Math.round((p.completedLessons / p.totalLessons) * 100)
            : 0,
      }));
      setCourses(items);
    };

    fetchProgress();
  }, []);

  const resumeCourse = async (course: CourseCard) => {
    if (!course.courseId) return;

    const res = await api.get(`/lessons/by-course/${course.courseId}`);
    const lessons = res.data;
    if (!lessons || lessons.length === 0) {
      alert("No lessons available for this course yet.");
      return;
    }

    const nextLesson = lessons[0];
    navigate(`/course/${course.courseId}/lesson/${nextLesson._id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Dashboard</h2>

      <section>
        <h3 className="font-semibold mb-1">Wallet Balance</h3>
        <p className="text-lg">৳{walletBalance}</p>
      </section>

      <section>
        <h3 className="font-semibold mb-3">Enrolled Courses</h3>
        {courses.length === 0 ? (
          <p className="text-sm text-gray-600">
            You have not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <div key={course.id} className="border rounded p-4 space-y-2">
                <h4 className="font-semibold">{course.title}</h4>

                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Progress: {course.progressPercent}%
                </p>

                <button
                  className="bg-blue-600 text-white text-sm rounded px-3 py-1 mt-1"
                  onClick={() => resumeCourse(course)}
                >
                  Resume
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
