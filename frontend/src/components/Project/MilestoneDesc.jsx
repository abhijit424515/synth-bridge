import React from "react";
import { useState } from "react";
import Subtask from "./Subtask";
import CourseRec from "./CourseRec";
import Subtasklist from "./Subtasklist";

export default function MilestoneDesc() {
  const [activeSubtask, setActiveSubtask] = useState(0);

  const subtasks = [
    {
      id: 0,
      name: "Subtask 1",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      status: true,
      client_score: 4,
    },
    {
      id: 1,
      name: "Subtask 2",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      status: false,
      client_score: 4,
    },
    {
      id: 2,
      name: "Subtask 3",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      status: false,
      client_score: 4,
    },
  ];

  return (
    <div className="milestone-desc-container text-left py-4 w-full flex ">
      <Subtasklist
        activeSubtask={activeSubtask}
        changeSubtask={(i) => setActiveSubtask(i)}
      />
      <Subtask
        name={subtasks[activeSubtask].name}
        description={subtasks[activeSubtask].description}
        status={subtasks[activeSubtask].status}
        client_score={subtasks[activeSubtask].client_score}
      />
      <CourseRec />
    </div>
  );
}
