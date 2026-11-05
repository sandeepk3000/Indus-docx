
import React from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import mainLogo from "../assets/indusdocx.png";

interface User {
  name?: string;
  picture?: string;
}

interface NavbarProps {
  isLoggedIn: boolean;
  user?: User;
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
    <header className="sticky top-3 z-50 w-full px-3 sm:px-5">
      <nav
        className="
          max-w-7xl mx-auto
          flex items-center justify-between
          h-14 sm:h-16
          px-4 sm:px-6
          rounded-full
          border border-gray-200/80
          bg-white/18 backdrop-blur-xl
          shadow-lg shadow-black/[0.04]
          transition-all duration-300
        "
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <img
            src={mainLogo}
            alt="Indus Docx"
            className="
              h-9 w-9 sm:h-10 sm:w-10
              rounded-full object-cover
              ring-2 ring-gray-100
              group-hover:scale-105
              transition-transform
            "
          />

          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
            Indus <span className="text-blue-600">Docx</span>
          </h1>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">

          {!isLoggedIn ? (
            <button
              onClick={onLogin}
              className="
                px-5 sm:px-7 py-2
                rounded-full
                bg-gray-900 text-white
                text-sm font-semibold
                shadow-md shadow-gray-900/10
                hover:bg-blue-600
                hover:shadow-blue-600/20
                active:scale-95
                transition-all duration-200
              "
            >
              Login
            </button>
          ) : (
            <>
              {/* User Profile */}
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src={user?.picture || "/default-avatar.png"}
                  alt="User"
                  className="
                    h-9 w-9 sm:h-10 sm:w-10
                    rounded-full object-cover
                    border-2 border-white
                    shadow-sm ring-1 ring-gray-200
                  "
                />

                <span className="hidden sm:block max-w-32 truncate text-sm font-semibold text-gray-800">
                  {user?.name || "User"}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={onLogout}
                title="Logout"
                className="
                  flex items-center justify-center
                  h-9 w-9 sm:h-10 sm:w-10
                  rounded-full
                  bg-red-50 text-red-500
                  border border-red-100
                  hover:bg-red-500 hover:text-white
                  active:scale-95
                  transition-all duration-200
                "
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
