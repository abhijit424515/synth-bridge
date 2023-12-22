import React from "react";
import { useState } from "react";
import Description from "../components/Project/Description";
import Milestones from "../components/Project/Milestones";
import Documents from "../components/Project/Documents";
import ChatWindow from "../components/KTChat/ChatWindow";
import { ToolCourseWindow } from "../components/KTChat/ToolCourseWindow";

// project view for students
export default function StudentProject() {
  const [milestones, setMilestones] = useState([]);
  const [tools, setTools] = useState([]);
  const [modal, setModal] = useState(false);
  const [isImprovementLoading, setIsImprovementLoading] = useState(false);

  return (
    <div className="w-full px-16 m-8">
      <div className="grid grid-cols-12 gap-4">
        <div className="project-left col-span-9">
          <Description
            isClient={false}
            setMilestones={(e) => setMilestones(e)}
          />
          {milestones && (
            <Milestones isClient={false} milestones={milestones} />
          )}
        </div>
        <div className="col-span-3 flex flex-col gap-4">
          <div
            className="flex p-2 bg-[#fbfbfb] w-full rounded-2xl shadow-md border border-gray-300 cursor-pointer"
            onClick={() => setModal(!modal)}
          >
            <img src="/ai.svg" />
            <div className="p-2 text-lg">Get query resolved with AI</div>
          </div>
          <a
            href="/meet"
            className="flex p-2 bg-[#fbfbfb] w-full rounded-2xl shadow-md border border-gray-300 cursor-pointer"
          >
            <img src="/video.svg" className="w-[1.75rem] mx-2" />
            <div className="p-2 text-lg">Video Chat</div>
          </a>
          <div className="col-span-3">
            <Documents isClient={false} />
          </div>
        </div>

        <div
          className={`${
            modal
              ? "fixed top-0 left-0 w-screen h-screen z-10 px-40 py-10 bg-[#44444490]"
              : "hidden"
          }`}
        >
          <div className="relative">
            <div
              onClick={() => {
                setModal(!modal);
              }}
              className="absolute w-8 h-8 flex items-center justify-center bg-gray-700 border border-gray-400 rounded-full -right-5 -top-5 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <div className="h-[85vh] w-[80vw] bg-white rounded-lg">
            <div className="grid grid-cols-12 h-[85vh]">
              <div className="col-span-8 m-2">
                <ChatWindow
                  isImprovementLoading={isImprovementLoading}
                  setIsImprovementLoading={setIsImprovementLoading}
                  setTools={setTools}
                />
              </div>
              <div className="col-span-4 m-2">
                <ToolCourseWindow
                  isImprovementLoading={isImprovementLoading}
                  tools={tools}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
