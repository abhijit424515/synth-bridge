import React from "react";
export default function Progressbar(props) {
  return (
    <div className="progress-bar w-full rounded-full bg-[#E7F7EE]">
      <div
        style={{ width: `${props.value}%` }}
        className="progress rounded-full bg-[#60BF6E] h-5"
      ></div>
    </div>
  );
}
