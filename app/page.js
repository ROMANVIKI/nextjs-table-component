import Image from "next/image";
import Dropdown from '../components/Dropdown'
import {themeChange} from 'theme-change'
import DataTable from '../components/DataTable'

export default function Home() {
  return (
      <div data-theme="forest">
        <Dropdown />
        <DataTable />
    </div>
  );
}
