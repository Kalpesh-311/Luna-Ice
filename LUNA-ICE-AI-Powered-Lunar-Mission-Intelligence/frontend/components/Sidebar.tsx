"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Mountain,
  Snowflake,
  ShieldAlert,
  MapPin,
  Navigation,
  Activity,
  Cpu,
  FileText,
  Download,
  Settings,
  Info,
  Rocket
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Terrain", href: "/terrain", icon: Mountain },
  { label: "Ice Detection", href: "/ice", icon: Snowflake },
  { label: "Hazard", href: "/hazard", icon: ShieldAlert },
  { label: "Landing Sites", href: "/landing", icon: MapPin },
  { label: "Planning", href: "/planning", icon: Rocket },
  { label: "Rover", href: "/rover", icon: Navigation },
  { label: "Analytics", href: "/analytics", icon: Activity },
  { label: "Model", href: "/model", icon: Cpu },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Downloads", href: "/downloads", icon: Download },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "About", href: "/about", icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 min-h-screen bg-gradient-to-b from-[#0a0f1f] via-[#090e1e] to-[#060b18] border-r border-blue-500/20 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-blue-500/20">
        <div className="flex items-center gap-4">
          <div className="p-0 rounded-2xl">
            <img
              src="/images/moon logo.png"
              alt="LUNA-ICE Logo"
              className="w-20 h-20 object-contain rounded-xl animate-spin-slow"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              LUNA-ICE
            </h2>
            <p className="text-gray-500 text-xs">Mission Control</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-300 ${
                  isActive ? "text-blue-300" : ""
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-blue-500/20">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <div className="text-sm">
              <p className="text-white font-medium">System Status</p>
              <p className="text-gray-400 text-xs">All Systems Go</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
