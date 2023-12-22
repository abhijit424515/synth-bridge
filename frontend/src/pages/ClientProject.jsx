import React from "react";
import { useState } from "react";
import Description from "../components/Project/Description";
import Milestones from "../components/Project/Milestones";
import Documents from "../components/Project/Documents";

// individual project view for client
export default function ClientProject() {
  const [milestones, setMilestones] = useState([]);

  return (
    <div className="w-full px-16 m-8">
      <div className="grid grid-cols-12 gap-4">
        <div className="project-left col-span-9">
          <Description
            isClient={true}
            setMilestones={(e) => setMilestones(e)}
          />
          {milestones && <Milestones isClient={true} milestones={milestones} />}
        </div>
        <div className="col-span-3 flex flex-col gap-4">
          <Documents isClient={true} />
        </div>
      </div>
    </div>
  );
}
