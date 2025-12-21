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

  const renderMedia = () => {
    const mediaItems = Array.isArray(lesson.media) ? lesson.media : [];

    if (mediaItems.length > 0) {
      return (
        <div className="mt-6 space-y-4">
          {mediaItems.map((item: any, index: number) => (
            <div key={index}>
              {item.type === "image" && (
                <img
                  src={item.url}
                  alt={lesson.title}
                  className="max-w-full rounded border"
                />
              )}
              {item.type === "video" && (
                <video
                  controls
                  src={item.url}
                  className="w-full max-w-2xl rounded border"
                />
              )}
              {item.type === "pdf" && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  Open lesson PDF
                </a>
              )}
              {item.type === "file" && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  Download lesson file
                </a>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (lesson.mediaUrl) {
      return (
        <div className="mt-6 space-y-4">
          {lesson.mediaType === "image" && (
            <img
              src={lesson.mediaUrl}
              alt={lesson.title}
              className="max-w-full rounded border"
            />
          )}
          {lesson.mediaType === "video" && (
            <video
              controls
              src={lesson.mediaUrl}
              className="w-full max-w-2xl rounded border"
            />
          )}
          {lesson.mediaType === "pdf" && (
            <a
              href={lesson.mediaUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Open lesson PDF
            </a>
          )}
          {lesson.mediaType === "file" && (
            <a
              href={lesson.mediaUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Download lesson file
            </a>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">{lesson.title}</h2>
      {lesson.content && <p className="mt-4">{lesson.content}</p>}

      {renderMedia()}

      <button onClick={markComplete} className="btn-primary mt-6">
        Mark as Completed
      </button>
    </div>
  );
};

export default LessonPage;
