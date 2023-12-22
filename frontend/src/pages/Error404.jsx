import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Generic 404 Error page
export default function Error404() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => navigate("/"), 3000);
  });
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex justify-center items-center">
      <div className="grid h-full px-4 bg-white place-content-center">
        <div className="text-center">
          <img
            src="/404.svg"
            alt="404"
            className="w-auto h-56 mx-auto text-black sm:h-64"
          />

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Uh-oh!
          </h1>

          <p className="mt-4 text-gray-500">We can't find that page.</p>
        </div>
      </div>
    </div>
  );
}
