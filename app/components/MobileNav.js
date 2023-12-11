'use client';
import Bars2 from "@/app/components/icons/Bars2";
import NotificationsButton from "@/app/components/NotificationsButton";
import {loginAndRedirect, logoutAndRedirect} from "@/app/hooks/AppContext";
import {signIn, signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function MobileNav() {
  const [navOpen, setNavOpen] = useState(false);
  const {status:sessionStatus} = useSession();
  const router = useRouter();
  function login() {
    loginAndRedirect(router, signIn);
  }
  return (
    <>
      <div className="md:hidden">
        <NotificationsButton />
      </div>
      <label
        onClick={() => setNavOpen(prev => !prev)}
        className="block md:hidden mobile-nav cursor-pointer">
        <Bars2 />
      </label>
      <input type="checkbox"
             id="navCb"
             checked={navOpen}
             onChange={() => {}}/>
      <div
        onClick={() => setNavOpen(false)}
        className="nav-popup fixed inset-0 bg-bgGray bg-opacity-80 p-4 rounded-2xl z-20 text-xl uppercase text-center pt-24">
        <div className="w-full">
          <div className="bg-bgGray border shadow-lg rounded-lg max-w-sm mx-auto mt-4 py-4">
            <nav>
              <Link className="block py-4" href={'/'}>Home</Link>
              <Link className="block py-4" href={'/pricing'}>Pricing</Link>
              <Link className="block py-4" href={'/help'}>Help</Link>
              <Link className="block py-4" href={'/subscription'}>Subscription</Link>
              {sessionStatus === 'unauthenticated' && (
                <>
                  <button
                    className="block py-4 w-full uppercase"
                    onClick={login}>Login</button>
                  <button
                    className="block py-4 w-full uppercase"
                    onClick={login}>Register</button>
                </>
              )}
              {sessionStatus === 'authenticated' && (
                <>
                  <Link
                    className="block py-4 w-full uppercase"
                    href={'/account'}>Account</Link>
                  <button
                    className="block py-4 w-full uppercase"
                    onClick={() => logoutAndRedirect(router, signOut)}
                  >Logout</button>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}