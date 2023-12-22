import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { DOMAIN } from "../../global/Functions";

export default function ViewSubtask({ isClient, setEdit, ...props }) {
  const [subtasks, setsubtasks] = useState([]);
  const [isChecked, setIsChecked] = useState([]);

  useEffect(() => {
    if (props.subtasks !== undefined) {
      setsubtasks(props.subtasks);
      setIsChecked(props.subtasks.map((subtask) => subtask.status));
    }
  }, [props.subtasks]);

  const handleClicked = async (i) => {
    if (isClient) return;

    setIsChecked((prevChecked) => {
      const updatedChecked = [...prevChecked];
      updatedChecked[i] = !updatedChecked[i];
      saveStatus(updatedChecked);
      return updatedChecked;
    });
  };

  async function saveStatus(updatedChecked) {
    const updatedSubtasks = subtasks.map((subtask, i) => {
      return {
        ...subtask,
        status: updatedChecked[i],
      };
    });

    try {
      const res = await axios.put(`${DOMAIN}/api/subtask`, {
        milestone_id: props._id,
        subtasks: updatedSubtasks,
      });
    } catch (err) {
      console.log(err);
    }
    const allChecked = updatedChecked.every((isChecked) => isChecked);
    if (allChecked) window.location.reload();
  }

  return (
    <div className="w-full p-2">
      {subtasks.map((subtask, i) => {
        return (
          <div className="w-full p-2 flex" key={i}>
            <div className="flex w-4/5">
              <div className="relative mr-4">
                <input
                  type="checkbox"
                  checked={isChecked[i]}
                  onClick={() => handleClicked(i)}
                  id={`checkbox-${i}`}
                />
                <label htmlFor={`checkbox-${i}`}></label>
              </div>
              <p
                className="ml-6"
                style={{ textDecoration: isChecked[i] ? "line-through" : "" }}
              >
                {subtask.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
