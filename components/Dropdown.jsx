"use client";
import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';

export default function ThemeDropdown() {
  const [isDropdown, setIsDropdown] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('system');
  const dropdownRef = useRef(null);

  // DaisyUI themes grouped by category
  const themes = {
    Light: ['light', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'lofi', 'winter'],
    Dark: ['dark', 'synthwave', 'cyberpunk', 'night', 'dracula', 'business'],
    Retro: ['retro', 'valentine', 'garden', 'aqua'],
    Other: ['cmyk', 'autumn', 'fantasy', 'wireframe', 'luxury', 'coffee']
  };

  // Theme icons mapping
  const themeIcons = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    system: <Monitor className="w-4 h-4" />
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const setTheme = (theme) => {
    const html = document.querySelector('html');
    html.setAttribute('data-theme', theme);
    setCurrentTheme(theme);
    setIsDropdown(false);
    // You might want to save the theme preference to localStorage here
  };

  return (
    <div ref={dropdownRef} className="relative flex justify-end">
      <div className="dropdown dropdown-end">
        <button 
          onClick={() => setIsDropdown(!isDropdown)}
          className="btn btn-ghost gap-2 normal-case"
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Theme</span>
        </button>

        {isDropdown && (
          <div className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-52 max-h-96 overflow-y-auto">
            {/* Quick theme options with icons */}
            <div className="menu-title">Quick Themes</div>
            <div className="grid grid-cols-3 gap-1 p-1 mb-2">
              {['light', 'dark', 'system'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setTheme(theme)}
                  className={`btn btn-sm ${currentTheme === theme ? 'btn-active' : 'btn-ghost'} gap-2`}
                >
                  {themeIcons[theme]}
                  <span className="capitalize">{theme}</span>
                </button>
              ))}
            </div>

            <div className="divider my-1"></div>

            {/* All DaisyUI themes grouped by category */}
            {Object.entries(themes).map(([category, categoryThemes]) => (
              <div key={category}>
                <div className="menu-title mt-2">{category}</div>
                {categoryThemes.map((theme) => (
                  <div
                    key={theme}
                    onClick={() => setTheme(theme)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                      ${currentTheme === theme ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}
                    `}
                  >
                    <div className="w-4 h-4 rounded-full border-2" style={{
                      backgroundImage: `linear-gradient(45deg, var(--p) 50%, var(--s) 50%)`
                    }}></div>
                    <span className="capitalize">{theme}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

