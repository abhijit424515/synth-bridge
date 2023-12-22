import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { project_id } from "../../global/Functions";
import { DOMAIN } from "../../global/Functions";

export default function Description({ setMilestones }) {
  const [project, setProject] = useState({});

  async function getData() {
    try {
      if (project_id) {
        const res = await axios.get(`${DOMAIN}/api/project/?_id=${project_id}`);
        const { title, description, milestones } = res.data;
        setProject({
          title,
          description,
          milestones,
        });
        setMilestones(milestones);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="description-container flex flex-col justify-evenly w-full mb-4 shadow-md left bg-[#fbfbfb] rounded-2xl px-8 py-6 border border-gray-300 hover:shadow-xl duration-200">
      <h1 className="project-title font-bold text-[#30343F] font-['Montserrat'] text-xlg pb-2">
        {project.title}
      </h1>
      <p className="main-description text-['#333333']">{project.description}</p>
    </div>
  );
}
