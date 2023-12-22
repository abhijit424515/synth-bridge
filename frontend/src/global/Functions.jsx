import React from "react";

// export const DOMAIN = import.meta.env.VITE_DOMAIN || "http://34.100.204.112";
// export const SOCKETDOMAIN =
//   import.meta.env.VITE_SOCKET_DOMAIN || "http://34.100.204.112";
// export const DOMAIN = "http://localhost:5050";
// export const SOCKETDOMAIN = "http://127.0.0.1:5051"

const IP = "localhost";
export const DOMAIN = `http://${IP}:5050`;
export const SOCKETDOMAIN = `http://${IP}:5051`;

export const project_id = localStorage.getItem("project_id")
  ? localStorage.getItem("project_id")
  : null;

export const client_id = "656c79a00e0f06f2f91b809a";

export const Loading = () => (
  <div className="h-[calc(100vh-5rem)] w-full flex justify-center items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="38"
      height="38"
      viewBox="0 0 38 38"
      stroke="black"
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  </div>
);
