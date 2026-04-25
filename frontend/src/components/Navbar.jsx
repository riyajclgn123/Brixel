import { NavLink } from "react-router-dom";

const links = [
  { to: "/",        label: "Dashboard"      },
  { to: "/history", label: "History"        },
  { to: "/braille", label: "Braille Viewer" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[60px] z-50
                    glass border-b border-white/[0.07]
                    flex items-center px-6 gap-6">

      {/* Logo */}
      <div className="flex items-center gap-2.5 font-syne font-bold text-[17px] text-white mr-4">
        <span className="w-2 h-2 rounded-full bg-[#0fd6a0] animate-pulse" />
        VisionBoard
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#0fd6a0]/10 text-[#0fd6a0]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Live status */}
      <div className="ml-auto flex items-center gap-2 text-[11px] font-semibold
                      bg-[#0fd6a0]/10 text-[#0fd6a0]
                      border border-[#0fd6a0]/30 px-3 py-1.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0fd6a0] animate-pulse" />
        Live
      </div>
    </nav>
  );
}
