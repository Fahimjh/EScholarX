import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<any>(null);
  const [completedMediaIds, setCompletedMediaIds] = useState<string[]>([]);

  // Load lesson details
  useEffect(() => {
    if (!lessonId) return;
    api.get(`/lessons/${lessonId}`).then((res) => {
      setLesson(res.data);
    });
  }, [lessonId]);

  // Load which materials are already completed for this lesson
  useEffect(() => {
    const fetchProgress = async () => {
      if (!lesson || !lesson.course) return;
      try {
        const courseId = (lesson.course as any)?._id ?? lesson.course;
        const res = await api.get(`/progress/course/${courseId}`);
        const entries = res.data.completedMaterialEntries || [];
        const ids = entries
          .filter((entry: any) => String(entry.lesson) === String(lesson._id))
          .map((entry: any) => String(entry.mediaId));
        setCompletedMediaIds(ids);
      } catch {
        // ignore missing progress for now
      }
    };

    fetchProgress();
  }, [lesson]);

  const markSectionComplete = async (items: any[]) => {
    if (!lessonId || !items || items.length === 0) return;

    const ids = items.map((item, idx) => String(item._id ?? idx));
    const toComplete = ids.filter((id) => !completedMediaIds.includes(id));

    if (toComplete.length === 0) return;

    await Promise.all(
      toComplete.map((id) => api.post(`/progress/complete/${lessonId}`, { mediaId: id }))
    );

    setCompletedMediaIds((prev) => [...prev, ...toComplete]);
  };

  if (!lesson) return <p>Loading...</p>;

  const mediaItems = Array.isArray(lesson.media) ? lesson.media : [];
  const videos = mediaItems.filter((item: any) => item.type === "video");
  const images = mediaItems.filter((item: any) => item.type === "image");
  const pdfs = mediaItems.filter((item: any) => item.type === "pdf");
  const files = mediaItems.filter((item: any) => item.type === "file");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold">{lesson.title}</h2>
        {lesson.content && (
          <p className="mt-4 text-sm md:text-base">{lesson.content}</p>
        )}

        {/* Video Section */}
        {videos.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-base mb-2">Video Materials</h3>
            <div className="flex flex-col items-center space-y-4">
              {videos.map((item: any, idx: number) => {
                const displayName = item.name || `Video ${idx + 1}`;
                return (
                  <div
                    key={item._id ?? idx}
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
            {(() => {
              const ids = videos.map((item: any, idx: number) =>
                String(item._id ?? idx)
              );
              const allDone = ids.every((id: string) =>
                completedMediaIds.includes(id)
              );
              return (
                <button
                  onClick={() => markSectionComplete(videos)}
                  disabled={allDone}
                  className={`mt-3 px-4 py-1 text-xs rounded border ${
                    allDone
                      ? "bg-green-600 border-green-500 text-white cursor-default"
                      : "border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  }`}
                >
                  {allDone ? "All videos completed" : "Mark all videos as completed"}
                </button>
              );
            })()}
          </div>
        )}

        {/* Image Section */}
        {images.length > 0 && (
          <div className="mt-4">
            {images.map((item: any, idx: number) => (
              <img
                key={item._id ?? idx}
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
                  <li key={item._id ?? idx} className="flex items-center gap-2">
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
            {(() => {
              const ids = pdfs.map((item: any, idx: number) =>
                String(item._id ?? idx)
              );
              const allDone = ids.every((id: string) =>
                completedMediaIds.includes(id)
              );
              return (
                <button
                  onClick={() => markSectionComplete(pdfs)}
                  disabled={allDone}
                  className={`mt-3 px-4 py-1 text-xs rounded border ${
                    allDone
                      ? "bg-green-600 border-green-500 text-white cursor-default"
                      : "border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  }`}
                >
                  {allDone ? "All PDFs completed" : "Mark all PDFs as completed"}
                </button>
              );
            })()}
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
                  <li key={item._id ?? idx}>
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
            {(() => {
              const ids = files.map((item: any, idx: number) =>
                String(item._id ?? idx)
              );
              const allDone = ids.every((id: string) =>
                completedMediaIds.includes(id)
              );
              return (
                <button
                  onClick={() => markSectionComplete(files)}
                  disabled={allDone}
                  className={`mt-3 px-4 py-1 text-xs rounded border ${
                    allDone
                      ? "bg-green-600 border-green-500 text-white cursor-default"
                      : "border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  }`}
                >
                  {allDone ? "All files completed" : "Mark all files as completed"}
                </button>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
