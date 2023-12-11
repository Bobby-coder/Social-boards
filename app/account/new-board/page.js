'use client';
import BoardForm from "@/app/account/BoardForm";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function NewBoardPage() {
  const router = useRouter();
  async function handleFormSubmit(boardData) {
    await axios.post('/api/board', boardData);
    router.push('/board/' + boardData.slug);
  }
  return (
    <>
      <h1 className="text-center text-4xl mb-8">New board</h1>
      <BoardForm buttonText={'Create Board'} onSubmit={handleFormSubmit} />
    </>
  );
}