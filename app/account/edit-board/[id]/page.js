'use client';
import BoardForm from "@/app/account/BoardForm";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function EditBoardPage() {
  const [board,setBoard] = useState(null);
  const {id} = useParams();
  const router = useRouter();
  useEffect(() => {
    if (id) {
      axios.get('/api/board?id='+id).then(res => {
        setBoard(res.data);
      });
    }
  }, [id]);
  async function handleBoardSubmit(boardData) {
    await axios.put('/api/board', {
      id:board._id, ...boardData,
    });
    router.push('/account');
  }
  return (
    <>
      <h1 className="text-center text-4xl mb-8">Edit board</h1>
      {board && (
        <BoardForm {...board} buttonText={'Update Board'} onSubmit={handleBoardSubmit} />
      )}
    </>
  );
}