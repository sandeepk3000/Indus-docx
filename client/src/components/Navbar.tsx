import React from "react";
import { Link } from "react-router-dom";
import mainLogo from "../assets/indusdocx.png";

interface NavbarProps {
  isLoggedIn: boolean;
  user?: any;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  user,
  onLogin,
  onLogout,
}) => {
  return (
    <nav className="w-full bg-white shadow-md top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo + Title */}
          <Link to={"/"}>
            <div className="flex items-center gap-3">
              <img
                src={mainLogo}
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <h1 className="text-xl font-bold text-gray-800">Indus Docx</h1>
            </div>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <button
                onClick={onLogin}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium 
                           hover:bg-blue-700 transition"
              >
                Login
              </button>
            ) : (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={user?.picture}
                    alt="User"
                    className="h-9 w-9 rounded-full object-cover border"
                  />
                  {/* Name hide on small screens */}
                  <span className="hidden sm:block text-gray-700 font-medium">
                    {user?.name}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm 
                             hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
