import { logout } from "@/store/userSlice";

import { useAuth0 } from "@auth0/auth0-react";
import { GraduationCap, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const { logout, isAuthenticated, user } = useAuth0();
  return (
    // create a footer with tailwind css my website name is indus docx
    // and copyright year is 2024

    <footer className="max-w-7xl mx-auto w-full rounded-[28px] border border-slate-200 bg-white px-6 sm:px-8 py-7 shadow-sm">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">Indus Docx</h3>
              <p className="text-xs text-slate-400">
                Learn Smarter. Grow Faster.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-500">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <Link to="/tests" className="hover:text-indigo-600">Tests</Link>
            <Link to="/courses" className="hover:text-indigo-600">Courses</Link>

            {isAuthenticated && (
              <button
                onClick={() =>
                  logout({
                    logoutParams: {
                      returnTo: window.location.origin,
                    },
                  })
                }
                className="flex items-center gap-2 text-red-500 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>

        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Indus Docx. Developed by Sandeep.
          All rights reserved.
        </div>

      </footer>
  );
};

export default Footer;
