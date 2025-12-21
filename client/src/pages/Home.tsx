import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
			<div className="max-w-3xl w-full grid gap-10 md:grid-cols-2 items-center">
				<div className="space-y-4">
					<p className="text-xs uppercase tracking-[0.25em] text-blue-400">
						Welcome to
					</p>
					<h1 className="text-3xl md:text-4xl font-bold leading-tight">
						ScholarX E‑Learning Platform
					</h1>
					<p className="text-sm md:text-base text-slate-300">
						Enroll in courses, track your progress, and access all your
						learning resources from one clean dashboard.
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
		</div>
	);
};

export default Home;
