"use client";
import { useState, useContext } from "react";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { ThemeContext } from "../app/page";

export default function ThemeDropdown() {
  const { setCurrentTheme, currentTheme } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const themeIcons = {
  //   light: <Sun className="w-8 h-8 text-yellow-500" />,
  //   dark: <Moon className="w-8 h-8 text-gray-800" />,
  //   system: <Monitor className="w-8 h-8 text-blue-500" />,
  //   cyberpunk: <Palette className="w-8 h-8 text-pink-500" />,
  //   cupcake: <Sun className="w-8 h-8 text-pink-400" />,
  //   bumblebee: <Sun className="w-8 h-8 text-yellow-400" />,
  //   emerald: <Sun className="w-8 h-8 text-green-500" />,
  //   corporate: <Monitor className="w-8 h-8 text-blue-600" />,
  //   synthwave: <Moon className="w-8 h-8 text-purple-500" />,
  // };

  const themeIcons = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    system: <Monitor className="w-4 h-4" />,
    cyberpunk: <Palette className="w-4 h-4 text-neon-pink" />,
    cupcake: <Sun className="w-4 h-4 text-pink-400" />,
    bumblebee: <Sun className="w-4 h-4 text-yellow-500" />,
    emerald: <Sun className="w-4 h-4 text-green-500" />,
    corporate: <Monitor className="w-4 h-4 text-blue-500" />,
    synthwave: <Moon className="w-4 h-4 text-purple-600" />,
    retro: <Palette className="w-4 h-4 text-orange-500" />,
    dracula: <Moon className="w-4 h-4 text-red-600" />,
    valentine: <Sun className="w-4 h-4 text-pink-600" />,
    garden: <Sun className="w-4 h-4 text-green-400" />,
    aqua: <Monitor className="w-4 h-4 text-teal-400" />,
    business: <Monitor className="w-4 h-4 text-gray-700" />,
    // Add more themes and their icons here
  };

  const setTheme = (theme) => {
    setCurrentTheme(theme);
    setIsModalOpen(false);
  };

  return (
    <div className="relative flex justify-end">
      {/* Button to open modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-ghost gap-2 normal-case"
      >
        <Palette className="w-6 h-6" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          data-theme={currentTheme}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        >
          <div
            data-theme={currentTheme}
            className="rounded-lg p-6 w-11/12 max-w-lg mx-auto shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Choose Theme</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-circle"
              >
                ✕
              </button>
            </div>

            {/* Theme Options */}
            <div data-theme={currentTheme} className="grid grid-cols-3 gap-4">
              {Object.entries(themeIcons).map(([theme, icon]) => (
                <div
                  key={theme}
                  onClick={() => setTheme(theme)}
                  className={`cursor-pointer p-4 rounded-lg flex flex-col items-center justify-center ${
                    currentTheme === theme
                      ? "bg-primary text-primary-content"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {icon}
                  <span className="mt-2 capitalize">{theme}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
