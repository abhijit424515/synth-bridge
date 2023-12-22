import React from "react";

export default function ToolCourseCard(props) {
  return (
    <a href={props.link} target="blank">
      <div className="border m-1 border-gray-300 rounded-md p-3 w-full focus:outline-none">
        <div className="text-xl font-semibold pb-1">
          <img
            className="float-left p-1 mt-1 mr-2"
            src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${props.link}`}
          />
          {props.projectname}
        </div>
        <p className="text-gray-500 line-clamp-3">{props.projectdescription}</p>
      </div>
    </a>
  );
}
