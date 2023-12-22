import React from "react";
import axios from "axios";
import { useState } from "react";
import { DOMAIN } from "../../global/Functions";
import toast from "react-hot-toast";
import { project_id } from "../../global/Functions";

const contentType = {
  pdf: "application/pdf",
  txt: "text/plain",
};

function DragDrop({ embed = true, ...props }) {
  const [file, setFile] = useState(null);
  const [bytes, setBytes] = useState();
  const [extension, setExtension] = useState();
  const [name, setName] = useState();
  const [ext, setExt] = useState();
  const [isOver, setIsOver] = useState(1);

  const handleChange = async (e) => {
    setIsOver(3);

    setFile(e.target.files[0]);
    const temp_name = e.target.files[0].name.split(".");
    setName(temp_name[0]);
    setExt(temp_name[temp_name.length - 1]);

    var byte = new Uint8Array(await e.target.files[0].arrayBuffer());
    setBytes(byte);
    const arr = e.target.files[0].name.split(".");
    setExtension(arr[arr.length - 1]);
  };

  const handleUpload = async () => {
    if (props.milestoneId !== undefined) {
      try {
        const res = await axios.post(
          `${DOMAIN}/api/project/add-milestone-file?_id=${props.milestoneId}&name=${name}&ext=${ext}`,
          bytes,
          {
            headers: {
              "Content-Type": contentType[extension],
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.post(
          `${DOMAIN}/api/project/add-file?_id=${project_id}&name=${name}&ext=${ext}&embed=${embed}`,
          bytes,
          {
            headers: {
              "Content-Type": contentType[extension],
            },
          }
        );
      } catch (error) {
        console.log(error);
        toast.error("Some error occured, check logs");
      }
    }
    setFile(null);
    setIsOver(1);
    toast.success("File Uploaded");
    window.location.reload(true);
  };

  const style = {
    backgroundColor:
      isOver == 1 ? "#F5F5F5" : isOver == 2 ? "#3A81F6" : "#23C466",
    border: "dashed 2px",
  };

  return (
    <div className="relative text-center rounded-md border border-dashed">
      <div
        className="dummy w-full h-20 rounded-md absolute text-gray-500 flex justify-center items-center font-[Montserrat] font-semibold text-sm px-[10%] -z-1"
        style={style}
      >
        {file ? <p>File Selected</p> : <p>Drag and Drop Files Here</p>}
        {/* <p>Upload Files <br />Only .pdf, .txt</p> */}
      </div>
      <input
        onDragOver={() => setIsOver(2)}
        onDragLeave={() => setIsOver(1)}
        onDragEnd={() => setIsOver(1)}
        type="file"
        onChange={handleChange}
        className="w-full h-20 hover:cursor-pointer opacity-0 bg-purple-600"
      />
      {file ? (
        <button
          onClick={handleUpload}
          className="bg-[#3A81F6] text-white rounded-md px-4 py-2 mt-2"
        >
          Upload
        </button>
      ) : null}
    </div>
  );
}

export default DragDrop;
