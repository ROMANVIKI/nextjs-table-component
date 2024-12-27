'use client'
import Image from "next/image";
import Dropdown from '../components/Dropdown'
import {themeChange} from 'theme-change'
import DataTable from '../components/DataTable'
import {createContext, useState} from 'react'

export const ThemeContext = createContext()

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState('system')
  return (
      <ThemeContext.Provider value={{setCurrentTheme, currentTheme}} >
      <div data-theme={currentTheme}>

        <DataTable />
      </div>
      </ThemeContext.Provider>
  );
}
