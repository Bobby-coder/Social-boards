import {AppContext} from "@/app/hooks/AppContext";
import {useContext, useEffect} from "react";

export default function BoardHeaderGradient({name,description,style}) {
  const {setStyle} = useContext(AppContext);
  useEffect(() => {
    if (window.location.href.includes('/board/')) {
      setStyle(style);
    } else {
      setStyle('oceanic');
    }
  }, []);
  return (
    <div className={
      "bg-gradient-to-r p-8 rounded-t-md "
      + (style === 'hyper'
          ? 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white'
          : style === 'oceanic'
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
            : style === 'cotton-candy'
              ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400'
              : style === 'gotham'
                ? 'bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white'
                : style === 'sunset'
                  ? 'bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100'
                  : style === 'mojave'
                    ? 'bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500'
                    : 'from-cyan-400 to-blue-400'
      )
    }>
      <h1 className="font-bold text-xl">{name}</h1>
      <p className="text-opacity-90">{description}</p>
    </div>
  );
}
// from-cyan-400 to-blue-400