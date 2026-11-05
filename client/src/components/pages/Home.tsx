
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FileQuestion,
  GraduationCap,
  LogOut,
  Sparkles,
  Search,
  Trophy,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

import useTest from "../../hooks/useTest";
import useMedia from "../../hooks/useMedia";
import Loading from "../Loading";
import type { TestDoc } from "../../../types";

const tabs = ["All", "Published", "Upcoming"];

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tests, setTests] = useState<TestDoc[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const { logout, isAuthenticated, user } = useAuth0();
  const { getTest } = useTest();
  const { getFileView } = useMedia();

  const roles = user?.["https://indusdocx.com/roles"];

  useEffect(() => {
    let mounted = true;

    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const res = await getTest();

        if (mounted) setTests(res.rows || []);
      } catch (error) {
        console.error("Failed to load tests:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchTests();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredTests = tests
    .filter((test) => {
      if (activeTab === "Published") return test.status === "PUBLISHED";
      if (activeTab === "Upcoming") return test.status === "UPCOMING";
      return true;
    })
    .filter((test) =>
      test.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.$createdAt).getTime() -
        new Date(a.$createdAt).getTime()
    );

  const publishedCount = tests.filter(
    (test) => test.status === "PUBLISHED"
  ).length;

  const upcomingCount = tests.filter(
    (test) => test.status === "UPCOMING"
  ).length;

  const getTestLink = (test: TestDoc) => {
    if (!isAuthenticated) return "/login";

    return roles?.includes("admin")
      ? `/admin/tests/${test.$id}/edit`
      : test.status === "UPCOMING"
        ? "/"
        : `/student/quiz/${test.$id}`;
  };

  return (
    <main className="min-h-screen px-3 sm:px-5 lg:px-8 pt-4 sm:pt-6 pb-8">

      {/* ================= HERO ================= */}

      <section className="relative max-w-7xl mx-auto overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#080D20] text-white shadow-xl shadow-indigo-950/10">

        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-indigo-600/30 blur-[120px]" />
          <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 h-40 w-96 -translate-x-1/2 rounded-full bg-purple-600/20 blur-[100px]" />

          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16 sm:py-20 lg:py-24">

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Content */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-xs sm:text-sm text-indigo-200 mb-7">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                Your Smart Learning Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Learn Smarter.
                <br />
                Grow{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Faster.
                </span>
              </h1>

              <p className="mt-6 max-w-xl mx-auto md:mx-0 text-base sm:text-lg leading-8 text-slate-400">
                Everything you need to learn, practice and succeed.
                Explore quality notes, educational resources and online
                tests with Indus Docx.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">

                <Link
                  to="/tests"
                  className="group w-full sm:w-auto flex items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#080D20] shadow-lg hover:bg-indigo-50 transition"
                >
                  Explore Tests
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/courses"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/10 transition"
                >
                  <BookOpen className="h-4 w-4" />
                  Explore Courses
                </Link>

              </div>

              <div className="mt-9 flex items-center justify-center md:justify-start gap-3 text-sm text-slate-400">
                <div className="flex -space-x-2">
                  {[GraduationCap, BookOpen, Trophy].map((Icon, i) => (
                    <div
                      key={i}
                      className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-[#080D20]"
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  ))}
                </div>
                <span>Learn. Practice. Achieve.</span>
              </div>
            </motion.div>

            {/* Right Dashboard Illustration */}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative max-w-lg w-full mx-auto"
            >
              <div className="absolute -inset-5 rounded-[40px] bg-gradient-to-r from-indigo-500/20 to-blue-500/20 blur-2xl" />

              <div className="relative rounded-[28px] border border-white/10 bg-white/[0.07] p-5 sm:p-7 shadow-2xl backdrop-blur-xl">

                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-xs text-slate-400">Welcome back</p>
                    <h3 className="mt-1 text-lg font-bold">
                      Learning Dashboard
                    </h3>
                  </div>

                  <div className="h-11 w-11 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-indigo-300" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                      <FileQuestion className="h-5 w-5 text-indigo-300" />
                    </div>
                    <p className="text-3xl font-bold">{tests.length}</p>
                    <p className="mt-1 text-xs text-slate-400">Total Tests</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    </div>
                    <p className="text-3xl font-bold">{publishedCount}</p>
                    <p className="mt-1 text-xs text-slate-400">Published</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-semibold text-sm">
                      Learning Resources
                    </span>
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                  </div>

                  {[
                    { icon: BookOpen, title: "Study Materials", color: "text-blue-300", bg: "bg-blue-500/20" },
                    { icon: Clock3, title: "Online Tests", color: "text-purple-300", bg: "bg-purple-500/20" },
                    { icon: CalendarDays, title: "Upcoming Tests", color: "text-amber-300", bg: "bg-amber-500/20" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 py-3 border-t border-white/10"
                    >
                      <div className={`h-9 w-9 rounded-xl ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        {item.title}
                      </span>
                      <ArrowRight className="h-4 w-4 ml-auto text-slate-500" />
                    </div>
                  ))}
                </div>

                <div className="absolute -right-4 -bottom-5 hidden sm:flex items-center gap-3 rounded-2xl border border-white/10 bg-[#17213D] p-4 shadow-xl">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Keep learning</p>
                    <p className="text-sm font-bold">Achieve More!</p>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="max-w-7xl mx-auto px-1 sm:px-2 mt-6 sm:mt-8">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {[
            {
              title: "Total Tests",
              value: tests.length,
              icon: FileQuestion,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              title: "Published Tests",
              value: publishedCount,
              icon: CheckCircle2,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              title: "Upcoming Tests",
              value: upcomingCount,
              icon: CalendarDays,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-sm hover:shadow-lg transition"
            >
              <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.title}</p>
              </div>
            </motion.div>
          ))}

        </div>
      </section>

      {/* ================= TEST SECTION ================= */}

      <section className="max-w-7xl mx-auto w-full px-1 sm:px-2 py-16 sm:py-20">

        <div className="rounded-[28px] sm:rounded-[36px] border border-slate-200/80 bg-white p-5 sm:p-8 lg:p-10 shadow-sm">

          {/* Heading */}

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-9">

            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold mb-3">
                <Sparkles className="h-4 w-4" />
                TEST YOUR KNOWLEDGE
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Explore Online Tests
              </h2>

              <p className="mt-3 text-sm sm:text-base text-slate-500">
                Practice, evaluate your knowledge and improve your performance.
              </p>
            </div>

            <Link
              to="/tests"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              View All Tests
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Search and Tabs */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 p-1.5 w-full sm:w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500 hover:bg-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tests..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

          </div>

          {/* Test Cards */}

          {isLoading ? (
            <div className="py-16">
              <Loading text="Loading Tests..." />
            </div>
          ) : filteredTests.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <FileQuestion className="h-8 w-8 text-indigo-400" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                No tests found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {search
                  ? "Try searching with another keyword."
                  : "There are no tests available in this category yet."}
              </p>

              <button
                onClick={() => {
                  setActiveTab("All");
                  setSearch("");
                }}
                className="mt-5 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition"
              >
                Reset Filters
              </button>
            </div>

          ) : (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredTests.map((test, index) => (
                <motion.div
                  key={test.$id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link
                    to={getTestLink(test)}
                    className="block h-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300"
                  >

                    <div className="relative h-48 overflow-hidden bg-slate-100">

                      <img
                        src={getFileView(test.thumbnail)}
                        alt={test.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      <span
                        className={`absolute top-4 right-4 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wide ${
                          test.status === "PUBLISHED"
                            ? "bg-emerald-500 text-white"
                            : test.status === "UPCOMING"
                              ? "bg-amber-400 text-slate-900"
                              : "bg-white/90 text-slate-700"
                        }`}
                      >
                        {test.status}
                      </span>

                      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-xs font-semibold">
                        <GraduationCap className="h-4 w-4" />
                        Indus Docx
                      </div>

                    </div>

                    <div className="p-5">

                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition">
                        {test.title}
                      </h3>

                      <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500 line-clamp-2">
                        {test.description}
                      </p>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">

                        <span className="text-xs font-medium text-slate-400">
                          Online Assessment
                        </span>

                        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                          {test.status === "UPCOMING" ? "Coming Soon" : "Start Test"}
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>

                      </div>
                    </div>

                  </Link>
                </motion.div>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* ================= FOOTER ================= */}

      

    </main>
  );
};

export default Home;
