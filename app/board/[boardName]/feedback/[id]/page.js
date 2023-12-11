'use client';
import Board from "@/app/components/Board";
import {useNarrowHeader} from "@/app/hooks/AppContext";
import {BoardInfoProvider} from "@/app/hooks/UseBoardInfo";

export default function FeedbackPage() {
  useNarrowHeader();
  return (
      <BoardInfoProvider>
        <Board />
      </BoardInfoProvider>
  );
}