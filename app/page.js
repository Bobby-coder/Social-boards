'use client';
import {useWideHeader} from "@/app/hooks/AppContext";
import {signOut} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Home() {
  useWideHeader();
  const router = useRouter();
  useEffect(() => {
    const isLogoutQuery = window.location.href.includes('/?logout');
    if (isLogoutQuery) {
      router.push('/');
      signOut({redirect: false});
    }
  }, []);
  return (
    <section className="grid grid-cols-1 gap-24 text-center my-16">
      <div className="">
        <h1 className="text-4xl mb-4 leading-tight">Your users will love Social Boards</h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">Experience a seamless, collaborative solution for user requests. Say goodbye to outdated spreadsheets and chaotic boards. Empower your customers, gain priceless insights.</p>
        <Link href={'/account'} className="bg-primary text-white px-6 py-4 rounded-lg">Try for free &rarr;</Link>
      </div>
      <div className="relative">
        <img src="/board.png" alt="" className="relative z-10 max-w-full md:max-w-lg mx-auto"/>
        <div className="bg-indigo-400 bg-opacity-20 w-[360px] h-[360px] rounded-full absolute left-[50%] -ml-[180px] top-[50%] -mt-[180px]"></div>
      </div>
    </section>
  )
}
