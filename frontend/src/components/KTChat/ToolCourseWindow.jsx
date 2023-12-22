import React from "react";
import ToolCourseCard from "./ToolCourseCard";
import PropagateLoader from "react-spinners/PropagateLoader";

export function ToolCourseWindow(props) {
  return (
    <div className="overflow-y-scroll overflow-x-hidden max-h-[80vh]">
      <div className="p-4">
        {props.isImprovementLoading ? (
          <PropagateLoader color="#228BE6" size={10} />
        ) : null}
      </div>
      {props.tools.reverse().map((tool, index) => (
        <ToolCourseCard
          key={index}
          projectname={tool.title}
          projectdescription={tool.description}
          link={tool.link}
        />
      ))}
    </div>
  );
}
