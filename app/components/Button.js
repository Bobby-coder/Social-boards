import {BoardInfoContext} from "@/app/hooks/UseBoardInfo";
import {useContext} from "react";

export default function Button(props) {
  const extraClasses = props?.className || '';
  const {style} = useContext(BoardInfoContext);

  return (
    <button
      {...props}
      disabled={props.disabled}
      className={
        "flex items-center gap-2 py-1 px-4 rounded-md text-opacity-90 "
        + extraClasses + ' '
        + (props.primary
          ? (
            style === 'hyper'
              ? 'bg-red-500 text-white'
              : style === 'oceanic'
                ? 'bg-blue-500 text-white'
                : style === 'cotton-candy'
                  ? 'bg-pink-300'
                  : style === 'gotham'
                    ? 'bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white'
                    : style === 'sunset'
                      ? 'bg-red-200'
                      : style === 'mojave'
                        ? 'bg-yellow-300'
                        : 'bg-blue-500 text-white'
          )
          : 'text-gray-600')
        + (props.disabled ? ' text-opacity-70 bg-opacity-70 cursor-not-allowed' : ' ')
      } />
  );
}