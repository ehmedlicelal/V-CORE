import React from 'react';
import { Sparkles, LogOut } from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition-colors cursor-pointer
     ${isActive
      ? "text-primary"
      : "text-gray-400 hover:text-white"
    }`;

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="h-6 w-6 text-cyan-400 group-hover:text-purple-400 transition-colors" />
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Antigravity</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">

            {user ? (
              <>
                <NavLink to="/roadmap" className={navClass}>
                  Roadmap
                </NavLink>

                <NavLink to="/roles" className={navClass}>
                  Roles
                </NavLink>

                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <span className="text-xs text-gray-500 hidden lg:block">
                    {user.email}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Logout
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer">
                Sign In
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
