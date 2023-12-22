import React from "react";

export function MButton({ handleClick, text }) {
  return (
    <div
      className="cursor-pointer rounded-lg duration-200 border-[2px] border-[#228BE6] bg-[#228BE6] px-8 py-3 text-sm text-white hover:bg-transparent hover:text-[#228BE6] focus:outline-none focus:ring text-[Roboto] active:text-indigo-500 font-bold max-w-max text-center"
      onClick={handleClick}
    >
      {text}
    </div>
  );
}
