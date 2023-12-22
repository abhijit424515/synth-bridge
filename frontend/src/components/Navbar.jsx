import React from "react";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isTermInPath = location.pathname.includes("client");

  return (
    <nav className="bg-white h-20 px-4 flex items-center justify-between p-4 w-full">
      <a
        href="/"
        className="flex items-center -translate-y-[0.1rem] duration-200 hover:shadow-md p-2 rounded-xl"
      >
        <img src="/logo.svg" className="h-10" alt="SynthBridge Logo" />
      </a>

      <div className="flex items-center">
        {!location.pathname.includes("test") && location.pathname != "/" && (
          <a
            href="/test"
            className="px-5 text-blue-400 hover:text-red-500 flex items-center justify-center duration-200 font-bold"
          >
            Back to Test
          </a>
        )}
        <div className="px-5 flex gap-4">
          <img
            className="w-10 h-10 rounded-full shadow-md"
            src="https://avatars.githubusercontent.com/u/124599?v=4"
            alt="user photo"
          />
          <div>
            <div className="text-md">
              {isTermInPath ? "Divya Srivastava" : "Chaitanya Gupta"}
            </div>
            <div className="text-xs text-gray-500">
              {isTermInPath ? "Client" : "Student"}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
