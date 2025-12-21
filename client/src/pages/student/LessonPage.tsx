import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    if (!lessonId) return;
    api.get(`/lessons/${lessonId}`).then((res) => {
      setLesson(res.data);
    });
  }, [lessonId]);

  const markComplete = async () => {
    if (!lessonId) return;
    await api.post(`/progress/complete/${lessonId}`);
  };

  if (!lesson) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">{lesson.title}</h2>
      <p className="mt-4">{lesson.content}</p>

      <button onClick={markComplete} className="btn-primary mt-6">
        Mark as Completed
      </button>
    </div>
  );
};

export default LessonPage;
