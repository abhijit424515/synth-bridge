import React from "react";
import { MButton } from "../components/MButton";

// Home Page
export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-[calc(100vh-5rem)] text-center">
      <div className="text-4xl font-bold">Welcome to SynthBridge!</div>
      <div className="text-2xl mb-4">
        This portal is designed to demonstrate the working of SynthBridge.
      </div>
      <a href="/test">
        <MButton text="Try it out" />
      </a>
    </div>
  );
}
