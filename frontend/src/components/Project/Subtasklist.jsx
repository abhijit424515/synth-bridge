import React from "react";
export default function Subtasklist({ changeSubtask, activeSubtask }) {
  const no_of_subtasks = 4;
  const active = activeSubtask;

  return (
    <div className="flex flex-col bg-white rounded-full shadow-md p-2">
      {[...Array(no_of_subtasks)].map((e, i) => {
        return i === active ? (
          <div
            onClick={() => changeSubtask(i)}
            className="rounded-full w-10 h-10 hover:bg-[#228BE6] hover:text-white bg-[#228BE6] text-white shadow-md flex justify-center items-center mt-1"
          >
            {i + 1}
          </div>
        ) : (
          <div
            onClick={() => changeSubtask(i)}
            className="rounded-full w-10 h-10 hover:bg-[#228BE6] hover:text-white bg-white shadow-md flex justify-center items-center mt-1"
          >
            {i + 1}
          </div>
        );
      })}
      <div className="rounded-full w-10 h-10 hover:bg-[#228BE6] hover:text-white bg-white shadow-md flex justify-center items-center mt-1">
        +
      </div>
    </div>
  );
}
