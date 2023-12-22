import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
const Error404 = lazy(() => import("./pages/Error404"));

import { Loading } from "./global/Functions";
import StudentProject from "./pages/StudentProject";
import ClientProject from "./pages/ClientProject";
import ClientDashboard from "./pages/ClientDashboard";
import RTCMeet from "./pages/RTCMeet";
import Test from "./pages/Test";

export default function App() {
  return (
    <Suspense fallback={Loading()}>
      <Router>
        <Navbar />
        <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/join" element={<LoginSignup />} /> */}
          <Route path="/meet" element={<RTCMeet />} />
          <Route path="/test" element={<Test />} />
          <Route path="/student/project" element={<StudentProject />} />
          <Route path="/client/project" element={<ClientProject />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </Suspense>
  );
}
