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
    // Separate media by type
    const videos = mediaItems.filter((item: any) => item.type === "video");
    const images = mediaItems.filter((item: any) => item.type === "image");
    const pdfs = mediaItems.filter((item: any) => item.type === "pdf");
    const files = mediaItems.filter((item: any) => item.type === "file");

    return (
      <>
        {/* Video Section */}
        {videos.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-base mb-2">Video Materials</h3>
            <div className="flex flex-col items-center space-y-4">
              {videos.map((item: any, idx: number) => {
                const displayName = item.name || `Video ${idx + 1}`;
                return (
                  <div
                    key={idx}
                    className="mb-2 border rounded overflow-hidden flex flex-col items-center"
                    style={{ width: 450, height: 380 }}
                  >
                    <video
                      controls
                      src={item.url}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                    <div className="w-full text-center text-xs py-1 bg-slate-900">
                      {displayName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Image Section */}
        {images.length > 0 && (
          <div className="mt-4">
            {images.map((item: any, idx: number) => (
              <img
                key={idx}
                src={item.url}
                alt={lesson.title}
                className="max-w-xs w-full mx-auto rounded border mb-4"
              />
            ))}
          </div>
        )}
        {/* Reading Materials (PDFs) Section */}
        {pdfs.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-base mb-2">Reading Materials</h3>
            <ul className="list-disc list-inside space-y-1">
              {pdfs.map((item: any, idx: number) => {
                const displayName = item.name || `PDF ${idx + 1}`;
                return (
                  <li key={idx}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 underline"
                    >
                      {displayName}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {/* Other Files Section */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-base mb-2">Downloadable Files</h3>
            <ul className="list-disc list-inside space-y-1">
              {files.map((item: any, idx: number) => {
                const fileName = item.url.split("/").pop();
                return (
                  <li key={idx}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 underline"
                    >
                      {fileName || `File ${idx + 1}`}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </>
    );
  };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold">{lesson.title}</h2>
          {lesson.content && <p className="mt-4 text-sm md:text-base">{lesson.content}</p>}

          {renderMedia()}

          <button onClick={markComplete} className="btn-primary mt-6">
            Mark as Completed
          </button>
        </div>
      </div>
    );
};

export default LessonPage;
