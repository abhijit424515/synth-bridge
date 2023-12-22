import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import ClientProjectCard from "../components/ClientDashboard/ClientProjectCard";
import { Loading, project_id } from "../global/Functions";
import { DOMAIN } from "../global/Functions";

// diplays projects details with summary
export default function ClientDashboard() {
  const [summary, setSummary] = useState();
  const [milestoneDescription, setMilestoneDescription] = useState();
  const [percentage, setPercentage] = useState(0);
  const [title, setTitle] = useState();

  async function getProjects() {
    try {
      const res = await axios.get(
        `${DOMAIN}/api/project/summary/?projectID=${project_id}`
      );
      setSummary(res.data.response);
      setMilestoneDescription(res.data.milestoneDescription);
      setTitle(res.data.project.title);
      setPercentage(
        res.data.totalSubtasks == 0
          ? 0
          : (res.data.finishedSubtasks / res.data.totalSubtasks) * 100
      );
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  return summary === undefined ? (
    <Loading />
  ) : (
    <div className="p-4">
      <div className="md:w-[650px] text-3xl font-bold mx-4">
        Active Projects
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 p-4">
        <ClientProjectCard
          summary={summary}
          desc={milestoneDescription}
          perc={percentage}
          title={title}
        />
        <ClientProjectCard
          summary="Our Sustainable Urban Mobility Platform is a groundbreaking initiative aimed at revolutionizing urban transportation. We've developed an integrated solution that seamlessly connects public transportation, bike-sharing, and ride-hailing services. Through careful data analysis and user feedback, we've tailored the platform to prioritize eco-friendly modes of transport, reducing overall carbon emissions. "
          desc="Implementation of a predictive analytics module for optimizing public transport routes based on historical usage patterns and real-time data, improving efficiency and reducing congestion."
          perc={50}
          title="Sustainable Urban Mobility Platform"
        />
        <ClientProjectCard
          summary="Created an educational app leveraging augmented reality to enhance STEM learning experiences. The app includes interactive 3D models, quizzes, and immersive simulations to make complex concepts more accessible and engaging for students."
          desc="Completion of the interactive virtual laboratory module, allowing students to conduct virtual experiments and simulations in a safe and controlled environment, fostering hands-on learning."
          perc={15}
          title="Augmented Reality App for STEM Education"
        />
      </div>
    </div>
  );
}
