import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, Image, Settings, Zap } from "lucide-react";

const navigationItems = [
  {
    title: "Camera",
    url: createPageUrl("Camera"),
    icon: Camera,
  },
  {
    title: "Gallery",
    url: createPageUrl("Gallery"), 
    icon: Image,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <style>
        {`
          :root {
            --electric-blue: #00D4FF;
            --deep-black: #000000;
            --charcoal: #1a1a1a;
            --silver: #f8f9fa;
          }
          
          .glass-effect {
            backdrop-filter: blur(20px);
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .electric-glow {
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
          }
          
          .smooth-transition {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}
      </style>
      
      {/* Main Content */}
      <main className="flex-1 relative">
        {children}
      </main>

      {/* Bottom Navigation - Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="glass-effect border-t border-gray-800 px-6 py-4">
          <div className="flex justify-around items-center">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex flex-col items-center gap-1 smooth-transition ${
                    isActive 
                      ? 'text-[var(--electric-blue)] electric-glow' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-full smooth-transition ${
                    isActive ? 'bg-[var(--electric-blue)]/20' : ''
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
