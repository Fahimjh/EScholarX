import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

interface Category {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  title: string;
  description?: string;
  price: number;
  category?: Category;
}

interface Lesson {
  _id: string;
  title: string;
  order?: number;
}

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const load = async () => {
      try {
        setLoading(true);
        setStatus(null);

        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/lessons/by-course/${courseId}`),
        ]);

        setCourse(courseRes.data);
        setLessons(lessonsRes.data);

        if (user) {
          try {
            const enrollRes = await api.get("/enrollments/my");
            const isEnrolled = Array.isArray(enrollRes.data)
              ? enrollRes.data.some((e: any) => e.course?._id === courseId)
              : false;
            setEnrolled(isEnrolled);
          } catch {
            // ignore enrollment fetch errors for anonymous users
          }
        }
      } catch (error: any) {
        setStatus(
          error?.response?.data?.message || "Failed to load course details.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!courseId) return;
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setStatus(null);
      await api.post("/enrollments", { courseId });
      setEnrolled(true);
      if (lessons[0]) {
        navigate(`/course/${courseId}/lesson/${lessons[0]._id}`);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to enroll in course.";
      setStatus(message);
    }
  };

  const handleOpenLesson = (lessonId: string) => {
    if (!courseId) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (!enrolled) {
      setStatus("Please enroll in this course to access lessons.");
      return;
    }

    navigate(`/course/${courseId}/lesson/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="p-6 text-slate-100">
        <p>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-slate-100">
        <p>Course not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">{course.title}</h1>
            {course.category && (
              <p className="text-xs text-slate-400 mb-1">
                Category: {course.category.name}
              </p>
            )}
            <p className="text-sm text-slate-300 mb-2">
              {course.description || "No description provided yet."}
            </p>
            <p className="text-sm font-semibold">
              Price: <span className="text-blue-400">৳{course.price}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleEnroll}
              className="bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded text-sm font-medium"
            >
              {user ? (enrolled ? "Go to first lesson" : "Enroll & Start") : "Login to enroll"}
            </button>
            {status && (
              <p className="text-xs text-red-400 max-w-xs text-right">{status}</p>
            )}
          </div>
        </div>

        <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/60">
          <h2 className="text-lg font-semibold mb-3">Lessons</h2>
          {lessons.length === 0 ? (
            <p className="text-sm text-slate-400">No lessons have been added yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {lessons.map((lesson) => (
                <li
                  key={lesson._id}
                  className="flex items-center justify-between border border-slate-800 rounded px-3 py-2 bg-slate-950/60"
                >
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    {lesson.order != null && (
                      <p className="text-xs text-slate-500">Lesson {lesson.order}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenLesson(lesson._id)}
                    className="text-xs px-3 py-1 rounded border border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  >
                    View lesson
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default CourseDetail;
