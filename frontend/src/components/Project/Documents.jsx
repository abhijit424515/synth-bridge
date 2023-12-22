import React from "react";
import DragDrop from "./FileUploader";
import FileList from "./Filelist";

export default function Documents(props) {
  return (
    <div className="documents bg-[#fbfbfb] w-full rounded-2xl p-4 shadow-md border border-gray-300 hover:shadow-xl duration-200">
      <h1 className="text-xl pl-2 mb-4 font-bold font-[Montserrat]">
        Shared Resources
      </h1>
      <FileList />
      {props.isClient && <DragDrop />}
    </div>
  );
}
