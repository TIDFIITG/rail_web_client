import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(authActions.logout());
    setIsOpen(false);
    navigate("/login");
  };

  const links = [
    { title: "Home", link: "/" },
    ...(isLoggedIn ? [{ title: "Dashboard", link: "/dashboard" }] : []),
    { title: "Contact Us", link: "/contact-us" },
    ...(isLoggedIn ? [{ title: "Profile", link: "/profile" }] : []),
    ...(isLoggedIn && role === "admin"
      ? [{ title: "Admin Dashboard", link: "/admin-dashboard" }]
      : []),
  ];

  const linkClass = (path) =>
    location.pathname === path
      ? "bg-railway-blue/10 text-railway-blue font-semibold"
      : "text-railway-text hover:bg-railway-bg hover:text-railway-blue";

  return (
    <div className="border-b border-railway-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <img
            className="h-9 w-9 rounded-full border border-railway-border object-cover"
            src={assets.logo}
            alt="Rail Watch Logo"
          />
          <h1 className="ml-2 text-base font-bold text-railway-navy sm:text-lg">
            Rail Watch
          </h1>
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((item, i) => (
            <Link
              to={item.link}
              key={i}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${linkClass(item.link)}`}
            >
              {item.title}
            </Link>
          ))}
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="ml-2 rounded bg-railway-blue px-4 py-1.5 text-sm font-semibold text-white hover:bg-railway-navy"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="rounded border border-railway-blue px-4 py-1.5 text-sm font-semibold text-railway-blue hover:bg-railway-bg"
              >
                Sign Up
              </Link>
            </>
          )}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="ml-2 rounded bg-railway-red px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Log Out
            </button>
          )}
        </div>

        <div className="lg:hidden">
          <img
            src={isOpen ? assets.close : assets.menu}
            alt="Menu Icon"
            className="h-7 cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 rounded-lg border border-railway-border bg-white p-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((item, i) => (
              <Link
                to={item.link}
                key={i}
                onClick={toggleMenu}
                className={`rounded px-4 py-2 text-sm font-medium text-center ${linkClass(item.link)}`}
              >
                {item.title}
              </Link>
            ))}
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="mt-1 rounded bg-railway-blue px-4 py-2 text-sm font-semibold text-white text-center"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={toggleMenu}
                  className="rounded border border-railway-blue px-4 py-2 text-sm font-semibold text-railway-blue text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="mt-1 rounded bg-railway-red px-4 py-2 text-sm font-semibold text-white text-center"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
