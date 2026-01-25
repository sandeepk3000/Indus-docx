// import Input from "../Input";
import { useState, useEffect } from "react";

// import { FaSearch } from "react-icons/fa";

import { useAuth0 } from "@auth0/auth0-react";
import useTest from "../../hooks/useTest";
import type { TestDoc } from "../../../types";
import Loading from "../Loading";
import { Link } from "react-router-dom";
import useMedia from "../../hooks/useMedia";

const Home = () => {
  // const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tests, setTests] = useState<TestDoc[]>([]);
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

  return (
    <div className="bg-slate-50">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1513258496099-48168024aec0"
          alt="Indus Docx"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        <div className="relative z-10 text-center px-4 max-w-3xl">
          <span className="inline-block mb-3 px-4 py-1 text-xs tracking-wider uppercase rounded-full bg-white/10 text-white">
            Welcome to Indus Docx (Developed by Sandeep)
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Learn Smarter. <br />
            <span className="text-indigo-400">Test Faster.</span>
          </h1>

          <p className="mt-4 text-gray-200 text-lg">
            Notes, Blogs aur Online Tests — sab kuch ek hi jagah.
          </p>

          {/* SEARCH */}
          <div className="mt-8 max-w-xl mx-auto"></div>

          {/* CTA */}
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <button className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-lg">
              Explore Notes
            </button>
            <button className="px-8 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition">
              Start Test
            </button>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Authenticated: {String(isAuthenticated)}
          </p>
        </div>
      </section>

      {/* ================= TESTS ================= */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Latest Tests</h2>
          <span className="text-sm text-gray-500">
            {tests.length} Available
          </span>
        </div>

        {isLoading ? (
          <Loading text="Loading Tests...." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((test, index) => (
              <Link
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
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="relative h-40">
                    <img
                      src={getFileView(test.thumbnail)}
                      alt={test.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
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
                      }
                    `}
                    >
                      {test.status}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                      {test.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {test.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Indus Docx</span>

                      <button className="px-4 py-1.5 text-sm rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition">
                        Start →
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t py-8 text-center text-sm text-gray-500">

        <button
          onClick={() => logout()}
          className="mt-2 text-red-500 hover:underline"
        >
          Logout
        </button>
      </footer>
    </div>
  );
};

export default Home;
