import axios from "axios";
import {usePathname} from "next/navigation";
import {createContext, useEffect, useState} from "react";
import {MoonLoader} from "react-spinners";

export const BoardInfoContext = createContext({});

export function useBoardSlug() {
  const pathName = usePathname();
  const result = /^\/board\/([a-z0-9\-]+)(\/.*)?$/.exec(pathName);
  const boardName = result?.[1];
  return boardName;
}

export async function isBoardAdmin(boardSlug) {
  const res = await axios.get('/api/board');
  return !!res.data.find(board => board.slug === boardSlug);
}

export function BoardInfoProvider({children}) {
  const boardSlug = useBoardSlug();
  const [loaded, setLoaded] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [boardName,setBoardName] = useState(boardSlug);
  const [boardAdmin,setBoardAdmin] = useState(undefined);
  const [boardDescription,setBoardDescription] = useState('');
  const [archived,setArchived] = useState(false);
  const [style, setStyle] = useState('hyper');
  useEffect(() => {
    if (boardSlug) {
      axios.get('/api/board?slug='+boardSlug).then(res => {
        setBoardName(res.data.name);
        setBoardAdmin(res.data.adminEmail);
        setBoardDescription(res.data.description);
        setArchived(res.data.archived);
        setStyle(res.data.style);
        setLoaded(true);
      }).catch(err => {
        if (err.response.status === 401) {
          setUnauthorized(true);
        }
        setLoaded(true);
      });
    }
  }, [boardSlug]);

  if (!loaded) {
    return (
      <div className="max-w-2xl mx-auto">
        <MoonLoader size={24} />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="bg-orange-200 p-4 max-w-2xl mx-auto">
        Sorry. You are not allowed to see this board
      </div>
    );
  }

  return (
    <BoardInfoContext.Provider value={{
      slug:boardSlug,
      name:boardName,
      description:boardDescription,
      archived,
      style,
    }}>
      {archived && (
        <div className="bg-orange-200 p-4 max-w-2xl mx-auto rounded-md">
          This board is archived.<br />
          <span className="text-black text-opacity-70 text-sm">
            No voting or new comments allowed
          </span>
        </div>
      )}
      {children}
    </BoardInfoContext.Provider>
  );
}