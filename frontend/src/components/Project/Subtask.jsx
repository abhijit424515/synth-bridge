import React from "react";
import { useEffect, useState } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import SubtaskBullet from "./SubtaskBullet";
import { MButton } from "./../MButton";
import { project_id } from "../../global/Functions";
import axios from "axios";
import { DOMAIN } from "../../global/Functions";

export default function Subtask(props) {
  const [generationStatus, setGenerationStatus] = useState(false);
  const [subtasks, setsubtasks] = useState([]);

  useEffect(() => {
    if (props.subtasks !== undefined) {
      setsubtasks(props.subtasks);
    }
  }, [props.subtasks]);

  const generateSubtasks = async () => {
    setGenerationStatus(true);
    const data = {
      projectId: project_id,
      milestoneId: props._id,
    };

    try {
      if (project_id) {
        const res = await axios.post(
          `${DOMAIN}/api/project/generate-subtask`,
          data
        );
        setsubtasks(res.data.list);
      }
    } catch (err) {
      console.log(err);
    }
    setGenerationStatus(true);
  };

  const saveSubtask = async () => {
    try {
      await axios.post(`${DOMAIN}/api/subtask`, {
        milestone_id: props._id,
        subtasks: subtasks,
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const updateSubtask = (index, text) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index - 1] = text;
    setsubtasks(newSubtasks);
  };

  const deleteSubtask = (index) => {
    const newSubtasks = [...subtasks];
    newSubtasks.splice(index - 1, 1);

    setsubtasks(newSubtasks);
  };

  const addSubtask = () => {
    const newSubtasks = [...subtasks];
    newSubtasks.push("");
    setsubtasks(newSubtasks);
  };

  return (
    <div className="subtask w-full pt-4">
      {subtasks.length === 0 ? (
        <MButton handleClick={generateSubtasks} text={"Generate Subtasks"} />
      ) : null}

      {subtasks.length === 0 ? (
        generationStatus ? (
          <div className="mt-2">
            <CircleLoader
              color={"#228BE6"}
              loading={generationStatus}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <div className="mt-4"></div>
        )
      ) : (
        <>
          {subtasks.map((task, index) => (
            <SubtaskBullet
              text={task}
              index={index + 1}
              updateSubtask={(index, text) => updateSubtask(index, text)}
              deleteSubtask={deleteSubtask}
            ></SubtaskBullet>
          ))}

          <div className="flex gap-4">
            <MButton handleClick={addSubtask} text={"Add New Subtask"} />
            <MButton handleClick={saveSubtask} text={"Save Subtasks"} />
          </div>
        </>
      )}
    </div>
  );
}
