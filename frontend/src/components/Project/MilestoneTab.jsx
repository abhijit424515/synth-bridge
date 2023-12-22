import React from "react";
export default function MilestoneTab({ setActive, active, no, status }) {
  return (
    <div className="cursor-pointer duration-200 rounded-full hover:shadow-lg">
      {status ? (
        <div
          className="check rounded-full w-10 h-10 bg-green-500 flex justify-center items-center text-white"
          onClick={() => setActive()}
        >
          <i className="fa-solid fa-check fa-xl"></i>
        </div>
      ) : active ? (
        <div
          className=" font-[Roboto] bg-[#228BE6] text-white rounded-full w-10 h-10 flex justify-center items-center"
          onClick={() => setActive()}
        >
          {no}
        </div>
      ) : (
        <div
          className=" font-[Roboto] hover:bg-[#228BE6] duration-200 bg-[#30343F] text-white rounded-full w-10 h-10 flex justify-center items-center"
          onClick={() => setActive()}
        >
          {no}
        </div>
      )}
    </div>
  );
}
