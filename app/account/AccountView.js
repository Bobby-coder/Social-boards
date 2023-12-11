'use client';
import Edit from "@/app/components/icons/Edit";
import axios from "axios";
import {signIn, useSession} from "next-auth/react";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function AccountView () {
  const {data:session, status} = useSession();
  const [boards, setBoards] = useState([]);
  const [isPremium,setIsPremium] = useState(null);
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('google');
    }
    if (status === 'authenticated') {
      axios.get('/api/board').then(res => {
        setBoards(res.data);
      });
      axios.get('/api/subscription').then(res => {
        const status = res.data?.stripeSubscriptionData?.object?.status;
        setIsPremium(status === 'active');
      });
    }
  }, [status]);

  if (status === 'loading') {
    return <>Loading...</>;
  }

  if (status === 'unauthenticated') {
    return <>Unauthenticated. Redirecting...</>;
  }

  const canWeCreateBoard = boards?.length === 0 || isPremium;

  return (
    <>
      <h1 className="text-center text-4xl mb-8">Your boards:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boards.map(board => (
          <div
            key={'board-tile-'+board.name}
            className={"rounded-md flex flex-col shadow-sm h-24 items-center justify-center text-center "
              + (board.archived ? 'bg-orange-100' : 'bg-white')
          }
            >
            <div className="grow flex items-center">
              <Link
                className="hover:underline"
                href={'/board/'+board.slug}>{board.name}</Link>
              {board.archived && (
                <div className="ml-2 text-orange-400">(archived)</div>
              )}
            </div>
            <div className="flex gap-4 p-2 w-full border-t border-black border-opacity-10 text-gray-700 text-sm">
              <Link
                className="block w-full text-center flex gap-2 items-center justify-center"
                href={'/account/edit-board/'+board._id}>
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <Link className="block w-full text-center border-l border-l-black border-opacity-10"
                    href={'/board/'+board.slug}>Visit &rarr;</Link>
            </div>
          </div>
        ))}

        {canWeCreateBoard && (
          <Link href={'/account/new-board'}
                className="block flex items-center justify-center bg-indigo-300 rounded-md shadow-sm py-2">
            <span>Add new board +</span>
          </Link>
        )}
      </div>
    </>
  );
}