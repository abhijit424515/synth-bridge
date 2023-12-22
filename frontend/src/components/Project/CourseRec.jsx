import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DOMAIN } from "../../global/Functions";
import img1 from "/photo1.jpg";
import img2 from "/photo2.jpg";
import img3 from "/photo3.jpg";

export default function CourseRec(props) {
  const [courses, setCourses] = useState([]);
  const [images, setImages] = useState([img1, img2, img3]);

  async function getCourse() {
    try {
      const res = await axios.post(`${DOMAIN}/api/services/courses`, {
        description: props.description,
      });
      setCourses(res.data.response);
      console.log(res.data.response);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (props.description !== undefined) {
      getCourse();
    }
  }, [props.description]);

  return (
    <div className="course-container mt-4 flex flex-col gap-4 pb-4">
      <h1 className="font-bold text-2xl font-[Montserrat] px-2 pt-4">
        Courses you might be interested in....
      </h1>
      {courses.map((course, i) => {
        return (
          <Link key={i} to={course.link} target="_blank" rel="noreferrer">
            <div className="rounded-lg shadow-md py-4 px-4 flex justify-around border gap-4 mx-2 border-gray-300">
              <img src={images[i % 3]} alt="" className="rounded-lg h-32" />
              <div className="w-full h-32 ellipsis">
                <h2 className="text-lg font-[Montserrat] font-bold">
                  {course.title}
                </h2>
                <div className="font-light h-full text-ellipsis">
                  {course.description
                    .replace("�", "'")
                    .replace("�", "'")
                    .replace("�", "'")}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
