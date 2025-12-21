import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

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

const Home = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string | "all">(
		"all",
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				setError(null);
				const [catRes, courseRes] = await Promise.all([
					api.get("/categories"),
					api.get("/courses"),
				]);
				setCategories(catRes.data);
				setCourses(courseRes.data);
			} catch (err: any) {
				setError(
					err?.response?.data?.message || "Failed to load courses and categories.",
				);
			} finally {
				setLoading(false);
			}
		};

		load();
	}, []);

	const filteredCourses =
		selectedCategory === "all"
			? courses
			: courses.filter((c) => c.category?._id === selectedCategory);

	return (
		<div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
			<div className="max-w-6xl mx-auto space-y-10">
				<div className="grid gap-8 md:grid-cols-2 items-center">
					<div className="space-y-4">
						<p className="text-xs uppercase tracking-[0.25em] text-blue-400">
							Welcome to
						</p>
						<h1 className="text-3xl md:text-4xl font-bold leading-tight">
							ScholarX E‑Learning Platform
						</h1>
						<p className="text-sm md:text-base text-slate-300">
							Browse all our courses by category, enroll in what you
							love, and track your learning journey from a simple
							dashboard.
						</p>
						<div className="flex flex-wrap gap-3 mt-2">
							<Link
								to="/login"
								className="bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded text-sm font-medium"
							>
								Login
							</Link>
							<Link
								to="/register"
								className="border border-slate-500 hover:border-blue-400 text-slate-100 hover:text-blue-300 transition px-4 py-2 rounded text-sm font-medium"
							>
								Register
							</Link>
						</div>
					</div>
					<div className="hidden md:block">
						<div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5 space-y-3 shadow-lg">
							<p className="text-sm font-semibold text-slate-100">
								Features
							</p>
							<ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
								<li>Student dashboard with progress tracking</li>
								<li>Admin panel for courses and lessons</li>
								<li>Cloud-hosted videos, PDFs, and resources</li>
							</ul>
						</div>
					</div>
				</div>

				<section className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Browse Courses</h2>
					</div>
					<div className="flex flex-wrap gap-2 text-xs md:text-sm">
						<button
							className={`px-3 py-1 rounded-full border ${selectedCategory === "all" ? "bg-blue-600 border-blue-500" : "border-slate-600"}`}
							onClick={() => setSelectedCategory("all")}
						>
							All
						</button>
						{categories.map((cat) => (
							<button
								key={cat._id}
								className={`px-3 py-1 rounded-full border ${selectedCategory === cat._id ? "bg-blue-600 border-blue-500" : "border-slate-600"}`}
								onClick={() => setSelectedCategory(cat._id)}
							>
								{cat.name}
							</button>
						))}
					</div>

					{loading && <p className="text-sm text-slate-300">Loading courses...</p>}
					{error && <p className="text-sm text-red-400">{error}</p>}

					{!loading && filteredCourses.length === 0 && (
						<p className="text-sm text-slate-400">
							No courses found for this category.
						</p>
					)}

					<div className="grid gap-4 md:grid-cols-3">
						{filteredCourses.map((course) => (
							<button
								key={course._id}
								onClick={() => navigate(`/course/${course._id}`)}
								className="text-left rounded-lg border border-slate-700 bg-slate-900/60 p-4 hover:border-blue-500 transition"
							>
								<p className="text-sm font-semibold mb-1">{course.title}</p>
								<p className="text-xs text-slate-400 line-clamp-2 mb-2">
									{course.description || "No description yet."}
								</p>
								<p className="text-xs text-slate-300">
									<span className="font-medium">৳{course.price}</span>
									{course.category && (
										<span className="ml-2 text-slate-500">
											{course.category.name}
										</span>
									)}
								</p>
							</button>
						))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default Home;
