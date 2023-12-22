import React from "react";
import { useEffect, useState } from "react";
import { DOMAIN, project_id } from "../../global/Functions";
import axios from "axios";
import logo from "../../assets/file.svg";

export default function Filelist() {
  const [files, setFiles] = useState([]);

  async function getFiles() {
    try {
      if (project_id) {
        const res = await axios.get(
          `${DOMAIN}/api/project/get-files?_id=${project_id}`
        );
        setFiles(res.data.files);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getFiles();
  }, []);

  async function handleClick(index) {
    try {
      if (project_id) {
        const fileName = `${project_id}:${index}`;
        const res = await axios.get(
          `${DOMAIN}/api/project/download-file?filename=${fileName}`
        );
        const fileBlob = new Blob([new Uint8Array(res.data.file.data)]);
        const downloadLink = document.createElement("a");
        const name = res.data.metadata.oname + "." + res.data.metadata.ext;
        downloadLink.href = URL.createObjectURL(fileBlob);
        downloadLink.download = name;
        downloadLink.click();
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="file_list rounded-lg p-1 pb-4 flex flex-col gap-2">
      {files.map((file, index) => {
        const capitalizedFile = file.charAt(0).toUpperCase() + file.slice(1);
        return (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="fileContainer w-full flex justify-between items-center bg-[#228BE6] rounded-lg cursor-pointer shadow-sm hover:shadow-lg duration-200"
          >
            <div className="w-10 p-2">
              <img src={logo} alt="file" />
            </div>
            <div className="w-4/5  no-scrollbar">
              <h2 className="font-[Roboto] float-left text-sm text-white">
                {capitalizedFile}
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
}
