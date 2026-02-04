import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import useTest from "../../hooks/useTest";
import useMedia from "../../hooks/useMedia";
import Loading from "../Loading";
import type { TestDoc } from "../../../types";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tests, setTests] = useState<TestDoc[]>([]);
  const [filteredTests, setFilteredTests] = useState<TestDoc[]>([]);
  const [activeTab, setActiveTab] = useState("All");

  const { logout, isAuthenticated, user } = useAuth0();
  const { getTest } = useTest();
  const { getFileView } = useMedia();
  const roles = user?.["https://indusdocx.com/roles"];

  useEffect(() => {
    setIsLoading(true);
    getTest().then((res) => {
      setTests(res.rows);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (activeTab === "All") setFilteredTests(tests);
    if (activeTab === "Published")
      setFilteredTests(tests.filter((t) => t.status === "PUBLISHED"));
    if (activeTab === "Upcoming")
      setFilteredTests(tests.filter((t) => t.status === "UPCOMING"));
  }, [activeTab, tests]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">

      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-b from-indigo-600 to-indigo-400 text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 md:py-32 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block mb-4 px-3 py-1 rounded-full bg-white/20 text-sm font-medium tracking-wide"
            >
              🚀 Welcome to Indus Docx
            </motion.span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mt-3">
              Learn Smarter. <br />
              <span className="text-yellow-300">Test Faster.</span>
            </h1>

            <p className="mt-5 text-lg max-w-lg mx-auto md:mx-0 text-white/80">
              Notes, blogs, and online tests — all in one place for focused learning and better results.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 rounded-xl bg-yellow-300 text-indigo-900 font-semibold shadow-lg"
              >
                Explore Notes
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
              >
                Start Test
              </motion.button>
            </div>

            <p className="mt-6 text-sm text-white/70">
              Status: {isAuthenticated ? "Signed in" : "Guest"}
            </p>
          </motion.div>

          {/* RIGHT VISUAL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden md:flex justify-center"
          >
            <div className="relative rounded-3xl bg-white p-6 shadow-2xl w-full max-w-md">
              <div className="space-y-3">
                <div className="h-4 w-32 bg-gray-200 rounded-full" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-5/6 bg-gray-200 rounded" />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-lg bg-gray-100" />
                  <div className="h-24 rounded-lg bg-gray-100" />
                </div>
              </div>
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-3xl border border-yellow-300/30 pointer-events-none"
              />
            </div>
          </motion.div>
        </div>

        <p className="absolute bottom-6 w-full text-center text-xs text-white/70">
          Developed by <span className="font-semibold">Sandeep</span>
        </p>
      </section>

      {/* ================= TESTS ================= */}
      <section className="max-w-7xl mx-auto px-4 py-16 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Tests ({filteredTests.length})
          </h2>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
            {["All", "Published", "Upcoming"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition ${
                  activeTab === t
                    ? "bg-white shadow text-indigo-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <Loading text="Loading Tests..." />
        ) : filteredTests.length === 0 ? (
          <p className="text-center text-gray-500">No tests available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTests
              .sort(
                (a, b) =>
                  new Date(b.$createdAt).getTime() -
                  new Date(a.$createdAt).getTime()
              )
              .map((test, index) => (
                <Link
                  key={test.$id}
                  to={
                    isAuthenticated
                      ? roles?.includes("admin")
                        ? `/admin/tests/${test.$id}/edit`
                        : test.status === "UPCOMING"
                        ? "/"
                        : `/student/quiz/${test.$id}`
                      : "/login"
                  }
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -3 }}
                    className="group bg-white rounded-2xl border hover:shadow-xl transition overflow-hidden"
                  >
                    {/* IMAGE */}
                    <div className="relative h-40">
                      <img
                        src={getFileView(test.thumbnail)}
                        alt={test.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* STATUS */}
                      <span
                        className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full
                      ${
                        test.status === "PUBLISHED"
                          ? "bg-green-500 text-white"
                          : test.status === "UPCOMING"
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      >
                        {test.status}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                          {test.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {test.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Indus Docx</span>

                        <motion.button
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                          className="px-4 py-1.5 text-sm rounded-lg bg-indigo-50 text-indigo-600"
                        >
                          Start →
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
          </div>
        )}
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 text-center text-sm text-gray-500">
        {isAuthenticated && (
          <button
            onClick={() => logout()}
            className="mt-2 text-red-500 hover:underline"
          >
            Logout
          </button>
        )}
      </footer>
    </div>
  );
};

export default Home;
