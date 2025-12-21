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
		<div className="min-h-screen bg-slate-950 text-slate-50">
			<div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
				<header className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold">Student Dashboard</h2>
						<p className="text-xs text-slate-400 mt-1">
							Track your learning progress and quickly jump back into
							courses.
						</p>
					</div>
				</header>

				<section className="grid gap-4 md:grid-cols-3">
					<div className="md:col-span-1 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
						<h3 className="font-semibold text-sm mb-1">Wallet Balance</h3>
						<p className="text-2xl font-bold">৳{walletBalance}</p>
						<p className="text-[11px] text-slate-400 mt-1">
							Wallet integration coming next.
						</p>
					</div>
					<div className="md:col-span-2 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
						<h3 className="font-semibold text-sm mb-2">Overview</h3>
						<p className="text-[11px] text-slate-400">
							Enroll in published courses to see your progress here.
						</p>
					</div>
				</section>

				<section className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
					<h3 className="font-semibold text-sm mb-3">Enrolled Courses</h3>
					{courses.length === 0 ? (
						<p className="text-xs text-slate-400">
							You have not enrolled in any courses yet.
						</p>
					) : (
						<div className="grid gap-4 md:grid-cols-2">
							{courses.map((course) => (
								<div
									key={course.id}
									className="border border-slate-800 rounded-lg p-4 space-y-2 bg-slate-900"
								>
									<h4 className="font-semibold text-sm">
										{course.title}
									</h4>

									<div className="w-full bg-slate-800 h-2 rounded">
										<div
											className="bg-green-500 h-2 rounded"
											style={{ width: `${course.progressPercent}%` }}
										/>
									</div>
									<p className="text-[11px] text-slate-400">
										Progress: {course.progressPercent}%
									</p>

									<button
										className="bg-blue-600 hover:bg-blue-500 transition text-white text-xs rounded px-3 py-1 mt-1"
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
		</div>
	);
};

export default Dashboard;
