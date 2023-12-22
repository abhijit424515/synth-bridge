import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { DOMAIN } from "../../global/Functions";
import Subtask from "./Subtask";
import { project_id } from "../../global/Functions";
import ViewSubtask from "./ViewSubtask";
import DragDrop from "./FileUploader";
import toast from "react-hot-toast";

export default function Milestone({ index, show, isClient, ...props }) {
  const [subtaskSaved, setsubtaskSaved] = useState([]);
  const [files, setFiles] = useState([]);
  const [showList, setShowList] = useState(false);

  async function getFiles() {
    try {
      const milestoneId = props._id; // Assign props._id to a variable
      if (milestoneId === undefined) return; // Check if milestoneId is undefined
      const res = await axios.get(
        `${DOMAIN}/api/project/get-milestone-files?_id=${milestoneId}` // Use the variable instead of props._id
      );
      setFiles(res.data.files);
    } catch (err) {
      console.log(err);
    }
  }

  async function downloadFile(index) {
    const fileName = `${props._id}:${index}`;
    try {
      const res = await axios.get(
        `${DOMAIN}/api/project/download-file?filename=${fileName}`
      );
      const fileBlob = new Blob([new Uint8Array(res.data.file.data)]);
      const downloadLink = document.createElement("a");
      const name = res.data.metadata.oname + "." + res.data.metadata.ext;
      downloadLink.href = URL.createObjectURL(fileBlob);
      downloadLink.download = name;
      downloadLink.click();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getFiles();
    if (props.subtasks !== undefined) {
      setsubtaskSaved(Object.values(props.subtasks));
    }
  }, [props.subtasks, show]);

  async function embedFile(index) {
    const fileName = `${props._id}:${index}`;
    try {
      await axios.post(`${DOMAIN}/api/project/embed`, {
        filename: fileName,
        projectId: project_id,
      });
      toast.success("Data integrated to Knowledge Base");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="milestone mt-4 rounded-lg">
      <div className="flex justify-around">
        <div className="milestone-desc text-justify mt-3 bg-[#228BE6] rounded-lg p-3 shadow-sm shadow-slate-300 w-3/4 px-4">
          <h2 className="font-bold text-white text-lg m-0 mb-2">Description</h2>
          <p className="text-white">{props.description}</p>
        </div>
        <div className="w-1/5 file-upload pt-3 relative">
          <h2 className="text-center mb-2 font-bold">Milestone Submissions</h2>
          {!isClient && <DragDrop embed={false} milestoneId={props._id} />}
          <div className="show-files">
            <div className="relative inline-block pt-2 w-full">
              <div>
                <button
                  type="button"
                  className="outline-none duration-200 inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => setShowList(!showList)}
                >
                  Uploaded Files
                  <svg
                    className="-mr-1 h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
                style={{ display: showList ? "block" : "none" }}
              >
                <div className="py-1" role="none">
                  {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
                  {files.length !== 0 ? (
                    files.map((file, index) => {
                      const capitalizedFile =
                        file.charAt(0).toUpperCase() + file.slice(1);
                      return (
                        <div
                          key={index}
                          className="flex justify-between pr-4 items-center"
                        >
                          <a
                            onClick={() => downloadFile(index)}
                            className="text-gray-700 block px-4 py-2 text-sm hover:cursor-pointer"
                            role="menuitem"
                            tabIndex="-1"
                            id="menu-item-0"
                          >
                            {capitalizedFile}
                          </a>
                          {isClient && (
                            <button
                              onClick={() => embedFile(index)}
                              className="rounded-full bg-[#228BE6] text-white w-6 h-6 flex justify-center items-center"
                            >
                              +
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex justify-center items-center">
                      No files uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {subtaskSaved.length === 0 && !isClient ? (
        <div className="mt-4 px-4">
          <h1 className="font-bold font-['Montserrat'] text-xlg text-[#30343F]">
            Subtasks
          </h1>
          <Subtask _id={props._id} subtasks={subtaskSaved}></Subtask>
        </div>
      ) : (
        <div className="mt-4 px-4">
          {subtaskSaved.length !== 0 && (
            <h1 className="font-bold font-['Montserrat'] text-xlg text-[#30343F]">
              Subtasks
            </h1>
          )}
          <ViewSubtask
            _id={props._id}
            setEdit={() => setEdit(true)}
            subtasks={subtaskSaved}
            isClient={isClient}
          />
        </div>
      )}
    </div>
  );
}
