import Input from "../Input";
import { useState, useEffect } from "react";
import Card from "../Card";
import { FaSearch } from "react-icons/fa";
import Typo from "../Typo";
import { useAuth0 } from "@auth0/auth0-react";
import useTest from "../../hooks/useTest";
import type { TestDoc } from "../../../types";
const Home = () => {
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tests, setTests] = useState<TestDoc[]>([]);
  const { logout, isAuthenticated } = useAuth0();
  const { getTest } = useTest();
  useEffect(() => {
    setIsLoading(true);
    getTest().then((res) => {
      setTests(res.rows);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 🔹 HERO / LANDING */}
      <div className="relative w-full h-[90vh] rounded-xl overflow-hidden">
        {/* 🔹 BACKGROUND IMAGE */}
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="Learning"
          className="w-full h-full object-cover"
        />

        {/* 🔹 DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* 🔹 CONTENT OVER IMAGE */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-2xl">
            {!isLoading && (
              <div className="text-xs text-gray-300 mb-2">
                Authenticated: {String(isAuthenticated)}
              </div>
            )}

            <Typo className="text-4xl md:text-5xl font-bold text-white">
              Indus Docx
            </Typo>

            <Typo className="mt-4 text-gray-200">
              Notes, Blogs aur Online Tests ke sath apni learning ko next level
              par le jao.
            </Typo>

            {/* 🔍 SEARCH */}
            <div className="mt-6 max-w-md mx-auto">
              <Input
                rightIcon={<FaSearch />}
                placeholder="Search notes, tests, blogs..."
                type="text"
                className="w-full bg-white/90"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>

            {/* 🔘 BUTTONS */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition">
                Explore Notes
              </button>
              <button className="px-6 py-2 border border-white text-white rounded-lg hover:bg-white/10 transition">
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 BLOGS / NOTES SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t">
        <Typo className="text-2xl font-semibold text-neutral-900 mb-6">
          Blogs & Notes
        </Typo>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </section>

      {/* 🔹 FOOTER ACTION */}
      <div className="text-center py-8 border-t">
        <button
          onClick={() => logout()}
          className="text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
