import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../../api/axios";

interface Category {
	_id: string;
	name: string;
}

interface Course {
	_id: string;
	title: string;
	price: number;
	isPublished: boolean;
	category?: Category;
}

const AdminDashboard = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [courses, setCourses] = useState<Course[]>([]);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [courseTitle, setCourseTitle] = useState("");
	const [courseDescription, setCourseDescription] = useState("");
	const [coursePrice, setCoursePrice] = useState<string>("");
	const [courseCategoryId, setCourseCategoryId] = useState("");
	const [coursePublished, setCoursePublished] = useState(false);
	const [lessonCourseId, setLessonCourseId] = useState("");
	const [lessonTitle, setLessonTitle] = useState("");
	const [lessonContent, setLessonContent] = useState("");
	const [lessonOrder, setLessonOrder] = useState<number>(1);
	const [lessonFiles, setLessonFiles] = useState<File[]>([]);
	const [status, setStatus] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const loadData = async () => {
		const [catRes, courseRes] = await Promise.all([
			api.get("/categories"),
			api.get("/courses"),
		]);
		setCategories(catRes.data);
		setCourses(courseRes.data);
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleCreateCategory = async (e: FormEvent) => {
		e.preventDefault();
		if (!newCategoryName.trim()) return;
		try {
			setStatus(null);
			await api.post("/categories", { name: newCategoryName.trim() });
			setNewCategoryName("");
			await loadData();
			setStatus("Category created.");
		} catch (error: any) {
			const message =
				error?.response?.data?.message || "Failed to create category.";
			setStatus(message);
		}
	};

	const handleCreateCourse = async (e: FormEvent) => {
		e.preventDefault();
		const priceNumber = Number(coursePrice);
		if (!courseTitle || !priceNumber) {
			setStatus("Please enter a title and price for the course.");
			return;
		}
		try {
			setStatus(null);
			await api.post("/courses", {
				title: courseTitle,
				description: courseDescription,
				price: priceNumber,
				category: courseCategoryId || undefined,
				isPublished: coursePublished,
			});
			setCourseTitle("");
			setCourseDescription("");
			setCoursePrice("");
			setCourseCategoryId("");
			setCoursePublished(false);
			await loadData();
			setStatus("Course created.");
		} catch (error: any) {
			const message =
				error?.response?.data?.message || "Failed to create course.";
			setStatus(message);
		}
	};

	const togglePublish = async (course: Course) => {
		try {
			await api.put(`/courses/${course._id}`, {
				isPublished: !course.isPublished,
			});
			await loadData();
		} catch {
			setStatus("Failed to update course.");
		}
	};

	const handleCreateLesson = async (e: FormEvent) => {
		e.preventDefault();
		if (!lessonCourseId || !lessonTitle) {
			setStatus("Please select a course and enter a lesson title.");
			return;
		}

		const formData = new FormData();
		formData.append("courseId", lessonCourseId);
		formData.append("title", lessonTitle);
		if (lessonContent) formData.append("content", lessonContent);
		formData.append("order", String(lessonOrder));
		if (lessonFiles.length > 0) {
			lessonFiles.forEach((file) => {
				formData.append("files", file);
			});
		}

		try {
			setLoading(true);
			setStatus(null);
			await api.post("/lessons", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setLessonTitle("");
			setLessonContent("");
			setLessonOrder(1);
			setLessonFiles([]);
			setStatus("Lesson created.");
		} catch (error: any) {
			const message =
				error?.response?.data?.message || "Failed to create lesson.";
			setStatus(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 max-w-5xl mx-auto space-y-6">
			<h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>

			<div className="grid gap-6 md:grid-cols-2">
				<form
					onSubmit={handleCreateCategory}
					className="space-y-3 border rounded p-4"
				>
					<h3 className="font-semibold text-lg">Create Category</h3>
					<input
						value={newCategoryName}
						onChange={(e) => setNewCategoryName(e.target.value)}
						placeholder="Category name"
						className="border rounded px-2 py-1 w-full"
					/>
					<button
						type="submit"
						className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
					>
						Add Category
					</button>
					<ul className="mt-2 text-sm text-gray-700 space-y-1">
						{categories.map((cat) => (
							<li key={cat._id}>{cat.name}</li>
						))}
					</ul>
				</form>

				<form
					onSubmit={handleCreateCourse}
					className="space-y-3 border rounded p-4"
				>
					<h3 className="font-semibold text-lg">Create Course</h3>
					<input
						value={courseTitle}
						onChange={(e) => setCourseTitle(e.target.value)}
						placeholder="Course title"
						className="border rounded px-2 py-1 w-full"
					/>
					<textarea
						value={courseDescription}
						onChange={(e) => setCourseDescription(e.target.value)}
						placeholder="Description"
						rows={3}
						className="border rounded px-2 py-1 w-full"
					/>
					<input
						type="text"
						inputMode="decimal"
						value={coursePrice}
						onChange={(e) => setCoursePrice(e.target.value)}
						placeholder="Input Price (bdt)"
						className="border rounded px-2 py-1 w-full"
					/>
					<select
						value={courseCategoryId}
						onChange={(e) => setCourseCategoryId(e.target.value)}
						className="border rounded px-2 py-1 w-full"
					>
						<option value="">No category</option>
						{categories.map((cat) => (
							<option key={cat._id} value={cat._id}>
								{cat.name}
							</option>
						))}
					</select>
					<label className="flex items-center gap-2 text-sm">
						<input
							checked={coursePublished}
							onChange={(e) => setCoursePublished(e.target.checked)}
							type="checkbox"
						/>
						<span>Published</span>
					</label>
					<button
						type="submit"
						className="bg-green-600 text-white px-4 py-1 rounded text-sm"
					>
						Create Course
					</button>
				</form>
			</div>

			<section className="border rounded p-4 space-y-3">
				<h3 className="font-semibold text-lg">Courses</h3>
				{courses.length === 0 ? (
					<p className="text-sm text-gray-600">No courses yet.</p>
				) : (
					<ul className="space-y-2 text-sm">
						{courses.map((course) => (
							<li
								key={course._id}
								className="flex items-center justify-between border rounded px-3 py-2"
							>
								<div>
									<p className="font-medium">{course.title}</p>
									<p className="text-xs text-gray-600">
										৳{course.price} · {course.category?.name || "No category"}
									</p>
								</div>
								<button
									onClick={() => togglePublish(course)}
									className="text-xs px-2 py-1 rounded border"
								>
									{course.isPublished ? "Unpublish" : "Publish"}
								</button>
							</li>
						))}
					</ul>
				)}
			</section>

			<form
				onSubmit={handleCreateLesson}
				className="space-y-3 border rounded p-4"
			>
				<h3 className="font-semibold text-lg">Create Lesson</h3>
				<select
					value={lessonCourseId}
					onChange={(e) => setLessonCourseId(e.target.value)}
					className="border rounded px-2 py-1 w-full"
				>
					<option value="">Select a course</option>
					{courses.map((course) => (
						<option key={course._id} value={course._id}>
							{course.title}
						</option>
					))}
				</select>
				<input
					value={lessonTitle}
					onChange={(e) => setLessonTitle(e.target.value)}
					placeholder="Lesson title"
					className="border rounded px-2 py-1 w-full"
				/>
				<textarea
					value={lessonContent}
					onChange={(e) => setLessonContent(e.target.value)}
					placeholder="Text content (optional)"
					rows={3}
					className="border rounded px-2 py-1 w-full"
				/>
				<input
					type="number"
					value={lessonOrder}
					min={1}
					onChange={(e) => setLessonOrder(Number(e.target.value) || 1)}
					className="border rounded px-2 py-1 w-full max-w-xs"
				/>
				<input
					type="file"
					multiple
					accept="image/*,video/*,application/pdf"
					onChange={(e) => {
						const files = e.target.files ? Array.from(e.target.files) : [];
						setLessonFiles(files);
					}}
				/>
				<p className="text-xs text-gray-600">
					{lessonFiles.length > 0
						? `${lessonFiles.length} file(s) selected`
						: "You can select multiple files (image, video, PDF)"}
				</p>
				<button
					type="submit"
					disabled={loading}
					className="bg-blue-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50"
				>
					{loading ? "Creating..." : "Create Lesson"}
				</button>
			</form>

			{status && <p className="text-sm mt-2">{status}</p>}
		</div>
	);
};

export default AdminDashboard;

