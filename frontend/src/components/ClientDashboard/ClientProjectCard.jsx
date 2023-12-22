import React from "react";
import { useNavigate } from "react-router-dom";

export default function ClientProjectCard({ summary, perc, desc, title }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl duration-200">
      <div
        className="overflow-hidden hover:cursor-pointer"
        onClick={() => navigate("/client/project")}
      >
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="w-full text-justify bg-[#228BE6] text-white p-4 pb-6 flex flex-col gap-2">
            <h1 className="text-white font-bold">{title}</h1>
            <p className="text-sm text-white h-[6rem] overflow-y-scroll custom-scrollbar">
              {summary}
            </p>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2">
          <h5 className="text-lg font-bold">Current Active Milestone</h5>
          <p className="text-sm text-gray-600 h-[4rem] overflow-y-scroll custom-scrollbar">
            {desc}
          </p>
        </div>
      </div>
      <div className="w-full bg-gray-200 h-2.5 dark:bg-gray-700">
        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${perc}%` }}></div>
      </div>
    </div>
  );
}
