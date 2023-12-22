import React from "react";
import { useEffect, useState } from "react";
import MilestoneTab from "./MilestoneTab";
import CourseRec from "./CourseRec";
import Milestone from "./Milestone";

export default function Milestones({ milestones, ...props }) {
  const [currentMilestone, setCurrentMilestone] = useState(1);
  const [curr, setCurr] = useState(false);
  const no_of_milestones = milestones.length;
  const active = milestones[currentMilestone - 1];

  useEffect(() => {
    const current = milestones.findIndex(
      (milestone) => milestone.status === false
    );
    setCurr(current + 1 === currentMilestone);
  }, [currentMilestone, milestones]);

  return (
    <div className="mx-auto bg-[#fbfbfb] w-full rounded-2xl p-4 shadow-md border border-gray-300 hover:shadow-xl duration-200">
      <div className="bar flex justify-between items-center pr-8 pl-4 pt-4">
        <div className="font-bold font-['Montserrat'] text-2xl mr-8 text-[#30343F]">
          Milestones
        </div>
        <div className="milestones-bar rounded-md p-4 w-full relative flex items-center ">
          <div className="absolute flex justify-between w-full">
            {[...Array(no_of_milestones)].map((e, i) => {
              return (
                <MilestoneTab
                  key={i}
                  setActive={() => setCurrentMilestone(i + 1)}
                  status={milestones[i].status}
                  active={currentMilestone == i + 1}
                  no={i + 1}
                />
              );
            })}
          </div>

          <hr className="bg-[#30343F] border-none h-0.5 w-full" style={{}} />
        </div>
      </div>
      {
        <Milestone
          _id={active && active._id}
          index={currentMilestone}
          show={curr}
          description={active && active.description}
          subtasks={active && active.subtasks}
          isClient={props.isClient}
        />
      }
      {!props.isClient && (
        <CourseRec description={active && active.description} />
      )}
    </div>
  );
}
