import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { DOMAIN } from "../global/Functions";
import { MButton } from "../components/MButton";

export default function Test() {
  const url = `${DOMAIN}/api/project`;
  const [project, setProject] = useState({
    title: "Medical Image Processing AI Model",
    description:
      "The Medical Image Processing Model project aims to develop an innovative solution leveraging deep learning for enhanced visualization and interpretation of medical images, particularly focusing on 3D reconstruction of Magnetic Resonance Imaging (MRI) scans. This advanced tool will empower healthcare professionals with improved diagnostic capabilities, time efficiency, and support for informed treatment planning.",
  }); // dummy data for description
  const [milestones, setMilestones] = useState([
    "Develop and implement a deep learning algorithm capable of converting 2D MRI scans into detailed three-dimensional representations. This transformation is aimed at enhancing spatial understanding and providing a more comprehensive view of the scanned anatomy.",
    "Ensure that the model achieves a high level of accuracy in processing images, thereby maintaining the integrity and fidelity of medical information which is critical for diagnostic purposes.",
    "Optimize the model for real-time processing, enabling swift interpretation of medical images, which is essential for quick diagnosis and decision-making in clinical settings",
    "Develop a user-friendly interface that allows healthcare professionals to interact effortlessly with the 3D visualizations, facilitating efficient analysis, annotation, and reporting",
    "Ensure that the system is compatible and can be seamlessly integrated with existing hospital or clinic information systems, making it straightforward for healthcare institutions to adopt the technology",
  ]); // dummy data for milestones
  const [fetchedProject, setfetchedProject] = useState({
    description: "",
    title: "",
    milestones: [],
  });
  const [_id, set_id] = useState(null);

  const project_exist = _id ? "" : "col-start-4";

  // get project data using project id stored in local storage
  async function getData() {
    try {
      if (_id) {
        const res = await axios.get(url + "?_id=" + _id);
        const title = res.data.title;
        const description = res.data.description;
        const emile = res.data.milestones.map((x) => x.description);
        setfetchedProject({
          title: title,
          description: description,
          milestones: emile,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const copy = localStorage.getItem("project_id")
      ? localStorage.getItem("project_id")
      : null;
    set_id(copy);
    getData();
  }, [_id]);

  function handleChange(e) {
    const { id, value } = e.target;
    setProject((prev) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  }

  // save project data in database
  async function handleSave() {
    const response = await axios.post(`${DOMAIN}/api/project`, {
      title: project.title,
      description: project.description,
      milestones: milestones,
    });
    localStorage.setItem("project_id", response.data._id);
    window.location.reload();
  }

  // delete temporary milestones' data
  function handleDelete(index) {
    setMilestones((prevMilestones) => {
      const updatedMilestones = [...prevMilestones];
      updatedMilestones.splice(index, 1);
      return updatedMilestones;
    });
  }

  // clear milestone description box
  function handleClear(index) {
    setMilestones((prevMilestones) => {
      const updatedMilestones = [...prevMilestones];
      updatedMilestones[index] = "";
      return updatedMilestones;
    });
  }

  // edit milestone description box
  async function handleMilestoneChange(e, index) {
    setMilestones((prevMilestones) => {
      const updatedMilestones = [...prevMilestones];
      updatedMilestones[index] = e.target.value;
      return updatedMilestones;
    });
  }

  // add new milestone
  async function handleAdd() {
    setMilestones((prevMilestones) => {
      const updatedMilestones = [...prevMilestones];
      updatedMilestones.push("New Milestone");
      return updatedMilestones;
    });
  }

  return (
    <div className="grid grid-cols-12 gap-4 px-12 py-8">
      {_id ? (
        <div className="col-span-6">
          <div className="text-4xl font-bold mb-12 text-green-500">
            Current Project in Testing
          </div>

          <h2 className="text-2xl font-bold">Project Title</h2>
          <p className="mt-2">{fetchedProject.title}</p>
          <div className="my-4">
            <h3 className="text-xl font-bold">Project Description</h3>
            <p className="mt-2">{fetchedProject.description}</p>
          </div>
          {fetchedProject.milestones.map((milestone, index) => (
            <div
              key={index}
              className="my-5 p-3 border border-gray-200 rounded-md"
            >
              <h4 className="text-lg font-semibold">Milestone {index + 1}</h4>
              <p className="mt-1">{milestone}</p>
            </div>
          ))}

          <div className="flex items-center justify-around gap-2 bg-white p-3">
            <a href="/student/project">
              <MButton
                className="bg-black text-white rounded-lg p-3"
                text={"Student Project View"}
              ></MButton>
            </a>
            <a href="/client/project">
              <MButton
                className="bg-blue-500 rounded-lg p-4 m-4 text-white"
                text={"Client Project View"}
              ></MButton>
            </a>
            <a href="/client/dashboard">
              <MButton
                className="bg-blue-500 rounded-lg p-4 m-4 text-white"
                text={"Client Dashboard"}
              ></MButton>
            </a>
          </div>
        </div>
      ) : null}
      <div className={project_exist + " col-span-6"}>
        <div className="text-4xl font-bold ml-10 mb-12 text-blue-500">
          Adding New Project
        </div>

        <div className="test px-10">
          <label
            htmlFor="title"
            className="text-2xl font-semibold"
          >
            Project Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter Project Title"
            value={project.title}
            onChange={handleChange}
            className="mt-2 relative block overflow-hidden rounded-md border border-gray-200 p-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 outline-none w-full"
          />
          <div>
            <label
              htmlFor="Project Description"
              className="my-5 pb-2 relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <h1 className="text-xl font-semibold mb-2">Project Description</h1>
              <textarea
                id="description"
                className=" w-full focus:border-transparent focus:outline-none custom-scrollbar"
                rows="4"
                placeholder="Enter Project Description"
                value={project.description}
                onChange={handleChange}
              ></textarea>
            </label>

            {milestones.map((milestone, index) => (
              <label
                key={index}
                htmlFor="Project Description"
                className="my-5 relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <h1 className="text-xl font-semibold">
                  Milestone {index + 1} Description
                </h1>
                <textarea
                  id="Description"
                  className=" my-2 w-full focus:border-transparent focus:outline-none scrollbar-hide custom-scrollbar"
                  rows="4"
                  placeholder={`Milestone ${index + 1} Description`}
                  value={milestone}
                  onChange={(e) => handleMilestoneChange(e, index)}
                ></textarea>
                <div className="flex items-center justify-end gap-2 bg-white p-3">
                  <button
                    type="button"
                    className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-600"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>

                  <button
                    type="button"
                    className="rounded bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    onClick={() => handleClear(index)}
                  >
                    Clear
                  </button>
                </div>
              </label>
            ))}

            <div className="flex items-center justify-around gap-2 bg-white p-3">
              <MButton handleClick={handleAdd} text="Add Milestone" />
              <MButton handleClick={handleSave} text="Test this Project" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
