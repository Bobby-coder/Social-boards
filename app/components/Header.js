'use client';
import DesktopNav from "@/app/components/DesktopNav";
import MobileNav from "@/app/components/MobileNav";
import {AppContext} from "@/app/hooks/AppContext";
import {useContext} from "react";


export default function Header() {
  const {narrowHeader} = useContext(AppContext);
  return (
    <>
      <header
        className={
          "flex gap-8 text-gray-600 h-24 items-center mx-auto "
          + (narrowHeader ? 'max-w-2xl' : '')
        }>
        <DesktopNav />
        <div className="grow md:hidden"></div>
        <MobileNav />
      </header>
    </>
  );
}