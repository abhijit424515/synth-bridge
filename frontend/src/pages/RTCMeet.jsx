import React from "react";
import { useRef, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import STORE from "../store/index.js";
import axios from "axios";
import SVGLoader from "../SVGLoader";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { DOMAIN } from "../global/Functions";

// initialize firebase and firestore
const app = initializeApp({
  apiKey: "AIzaSyAyNl4x_WeVHKf0KR9qK8o3td1ci40_c_Y",
  authDomain: "trumio-webrtc.firebaseapp.com",
  projectId: "trumio-webrtc",
  storageBucket: "trumio-webrtc.appspot.com",
  messagingSenderId: "281065454219",
  appId: "1:281065454219:web:dd6c86361504892ccef28e",
});
const db = getFirestore(app);

// Ice configuration for WebRTC
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function Meet() {
  const [transcripted, setTranscripted] = useState(null);

  const webcamVideoRef = useRef(null);
  const callInputRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const callButtonRef = useRef(null);
  const answerButtonRef = useRef(null);
  const hangupButtonRef = useRef(null);

  const localRecordRef = useRef(null);
  const remoteRecordRef = useRef(null);
  const pc = useRef(new RTCPeerConnection(servers));

  const ffmpegRef = useRef(new FFmpeg());

  const recordingLocal = STORE((state) => state.recordingLocal);
  const setRecordingLocal = STORE((state) => state.setRecordingLocal);
  const recordingRemote = STORE((state) => state.recordingRemote);
  const setRecordingRemote = STORE((state) => state.setRecordingRemote);

  const host = STORE((state) => state.host);
  const setHost = STORE((state) => state.setHost);
  const localBlob = STORE((state) => state.localBlob);
  const setLocalBlob = STORE((state) => state.setLocalBlob);
  const remoteBlob = STORE((state) => state.remoteBlob);
  const setRemoteBlob = STORE((state) => state.setRemoteBlob);

  const startTime = STORE((state) => state.startTime);
  const setStartTime = STORE((state) => state.setStartTime);
  const endTime = STORE((state) => state.endTime);
  const setEndTime = STORE((state) => state.setEndTime);

  const wcs = STORE((state) => state.wcs);
  const setWcs = STORE((state) => state.setWcs);

  const [loading, setLoading] = useState(false);

  async function init() {
    const ls = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setWcs(ls);
    return ls;
  }

  const setupMediaSources = async (ls) => {
    const newLocalStream = new MediaStream();

    ls.getTracks().forEach((track) => {
      pc.current.addTrack(track, ls);
      newLocalStream.addTrack(track);
    });

    pc.current.ontrack = (event) => {
      const newRemoteStream = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        newRemoteStream.addTrack(track);
      });
    };

    return ls;
  };
  useEffect(() => {
    init().then((ls) => setupMediaSources(ls).then((ls) => enableWebcam(ls)));
    loadFFMpeg();
  }, []);

  // start webcam
  const enableWebcam = async (ls) => {
    const newRemoteStream = new MediaStream();

    pc.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        newRemoteStream.addTrack(track);
      });
    };

    webcamVideoRef.current.srcObject = ls;
    remoteVideoRef.current.srcObject = newRemoteStream;

    callButtonRef.current.disabled = false;
    answerButtonRef.current.disabled = false;
  };

  const handleCallClick = async () => {
    const callsCollection = collection(db, "calls");
    const callDocRef = await addDoc(callsCollection, {}); // Add an empty document to generate an ID
    const offerCandidatesRef = collection(callDocRef, "offerCandidates");
    const answerCandidatesRef = collection(callDocRef, "answerCandidates");

    callInputRef.current.value = callDocRef.id;
    navigator.clipboard.writeText(callDocRef.id);
    toast.success("Meeting ID copied to clipboard");

    pc.current.onicecandidate = (event) => {
      event.candidate && addDoc(offerCandidatesRef, event.candidate.toJSON());
    };

    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    await setDoc(callDocRef, {
      offer: {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      },
    });

    onSnapshot(callDocRef, (snapshot) => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current.setRemoteDescription(answerDescription);
        setHost(true);
        setRecordingLocal(true);
      }
    });

    onSnapshot(answerCandidatesRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.current.addIceCandidate(candidate);
        }
      });
      if (snapshot.docChanges().length > 0) {
        setHost(true);
        setRecordingRemote(true);
      }
    });

    hangupButtonRef.current.disabled = false;
  };

  const handleAnswerClick = async () => {
    const callId = callInputRef.current.value;
    const callDocRef = doc(db, "calls", callId);
    const answerCandidatesRef = collection(callDocRef, "answerCandidates");
    const offerCandidatesRef = collection(callDocRef, "offerCandidates");

    pc.current.onicecandidate = (event) => {
      event.candidate && addDoc(answerCandidatesRef, event.candidate.toJSON());
    };

    const callData = (await getDoc(callDocRef)).data();

    const offerDescription = callData.offer;
    await pc.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    await updateDoc(callDocRef, {
      answer: {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      },
    });

    onSnapshot(offerCandidatesRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
      setRecordingRemote(true);
    });

    onSnapshot(callDocRef, async (snapshot) => {
      const data = snapshot.data();
      if (data) {
        if (data.hangup) {
          await close_and_reinitiate_rtc();
        } else {
          setHost(false);
          setRecordingLocal(true);
        }
      }
    });
  };

  const handleHangupClick = async () => {
    const callDocRef = doc(db, "calls", callInputRef.current.value);
    await updateDoc(callDocRef, { hangup: true });

    await close_and_reinitiate_rtc();
    await stopRecording();
  };

  async function close_and_reinitiate_rtc() {
    pc.current.close();
    webcamVideoRef.current.srcObject
      .getTracks()
      .forEach((track) => track.stop());
    remoteVideoRef.current.srcObject
      .getTracks()
      .forEach((track) => track.stop());

    webcamVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;
    callInputRef.current.value = "";
    hangupButtonRef.current.disabled = true;

    if (!host) {
      window.location.reload(true);
    }
  }

  // record the local video feed
  const recordLocal = () => {
    try {
      const mediaRecorder = new MediaRecorder(wcs);
      localRecordRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        let blob = new Blob(chunks, { type: "video/webm" });
        blob = await transcode(blob);
        setLocalBlob(blob);
      };
      
      if (mediaRecorder) mediaRecorder.start();
    }
     catch (e) {
      console.log(mediaRecorder);
      console.log(e);
    }
  };

  // record the remote video feed
  const recordRemote = () => {
    try {
      const mediaRecorder = new MediaRecorder(remoteVideoRef.current.srcObject);
      remoteRecordRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        let blob = new Blob(chunks, { type: "video/webm" });
        blob = await transcode(blob);
        setRemoteBlob(blob);
      };

      if (mediaRecorder) mediaRecorder.start();
    }
    catch (e) {
      console.log(mediaRecorder);
      console.log(e);
    }
  };

  // stop meet recording
  const stopRecording = async () => {
    console.log(`saving audio... ${host}`);
    setEndTime(new Date());
    localRecordRef.current.stop();
    remoteRecordRef.current.stop();
    if (!host) {
      toast.success("The meet has ended");
      window.location.reload(true);
    }
  };

  useEffect(() => {
    if (recordingLocal && recordingRemote) {
      console.log("audio recording started...");
      setStartTime(new Date());
      if (host) {
        recordLocal();
        recordRemote();
      }
    }
  }, [recordingLocal, recordingRemote]);

  // async function save_blob(blob, name) {
  //   if (document) {
  //     console.log("SAVE");
  //     var blobUrl = URL.createObjectURL(blob);
  //     var link = document.createElement("a"); // Or maybe get it from the current document
  //     link.href = blobUrl;
  //     link.download = name;
  //     link.innerHTML = "Click here to download the file";
  //     link.click();
  //   }
  // }

  useEffect(() => {
    if (localBlob != null && remoteBlob != null) {
      mixAudio(localBlob, remoteBlob).then(async (new_blob) => {
        setLoading(true);
        // await save_blob(new_blob, "mixed.webm");
        await send_files_to_server(new_blob);
        setLoading(false);
      });
    }
  }, [localBlob, remoteBlob]);

  // transribe the audio file to text, and passing it to LLM chain for further processing
  async function send_files_to_server(blob) {
    const pid = localStorage.getItem("project_id");
    if (pid) {
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const res = await axios.post(
        `${DOMAIN}/fast-api/services/openai/whisper?projectId=${pid}`,
        bytes,
        {
          headers: { "Content-Type": "audio/webm" },
        }
      );
      setTranscripted(res.data);
    }
  }

  // load FFMPEG Web Assembly binaries
  const loadFFMpeg = async () => {
    try {
      console.log("Loading FFMPEG...");
      const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.4/dist/esm";
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on("log", ({ message }) => console.log(message));
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          "text/javascript"
        ),
      });
      console.log("FFMPEG loaded");
    } catch (e) {
      console.log(e);
      toast.error("WASM Memory full, please restart browser");
    }
  };

  // convert video/webm to audio/webm using FFMPEG
  const transcode = async (blob) => {
    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile("input.webm", await fetchFile(blob));
      await ffmpeg.exec([
        "-i",
        "input.webm",
        "-vn",
        "-acodec",
        "libopus",
        "output_audio.webm",
      ]);
      const data = await ffmpeg.readFile("output_audio.webm");
      const b = new Blob([data], { type: "audio/webm" });
      return b;
    } catch (error) {
      console.error("FFmpeg Error:", error);
    }
  };

  const mixAudio = async (audioBlob1, audioBlob2) => {
    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile("input1.webm", await fetchFile(audioBlob1));
      await ffmpeg.writeFile("input2.webm", await fetchFile(audioBlob2));

      const duration = endTime - startTime - 200;
      await ffmpeg.exec([
        "-i",
        "input1.webm",
        "-i",
        "input2.webm",
        "-filter_complex",
        `[0:a]adelay=0|0[a1];[1:a]adelay=${duration}|${duration}[a2];[a1][a2]amix=inputs=2:duration=longest[a]`,
        "-map",
        "[a]",
        "output_mixed.webm",
      ]);

      const mixedData = await ffmpeg.readFile("output_mixed.webm");
      const mixedBlob = new Blob([mixedData], { type: "audio/webm" });
      return mixedBlob;
    } catch (error) {
      console.error("FFmpeg Error:", error);
    }
  };

  return (
    <>
      {loading ? (
        <SVGLoader />
      ) : transcripted == null ? (
        <div className="w-full flex flex-col p-8">
          <div className="flex mb-8 md:flex-row flex-col gap-8 w-full">
            <video
              ref={webcamVideoRef}
              autoPlay
              playsInline
              muted
              className="md:w-1/3 w-3/5 border-2 border-gray-300 rounded-3xl mx-auto shadow-md"
            />
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                display: Boolean(webcamVideoRef?.current?.srcObject)
                  ? ""
                  : "none",
              }}
              className="md:w-1/3 w-3/5 border-2 border-gray-300 rounded-3xl mx-auto shadow-md"
            />
          </div>
          <div className="flex flex-col w-2/3 mx-auto">
            <div className="flex justify-between w-full gap-8">
              <button
                ref={callButtonRef}
                onClick={handleCallClick}
                className="py-2 px-4 m-2 bg-green-500 text-white rounded-xl w-max mx-auto shadow-md"
              >
                Create a Meet
              </button>
              <button
                ref={answerButtonRef}
                onClick={handleAnswerClick}
                className="py-2 px-4 bg-blue-500 text-white rounded-xl m-2 w-max mx-auto shadow-md"
              >
                Join a Meet
              </button>
            </div>
            <div className="w-full max-w-sm m-2 mx-auto flex items-center border-2 border-gray-300 rounded-md shadow-md overflow-hidden">
              <input
                ref={callInputRef}
                placeholder="Meeting ID"
                className="w-full py-2 px-4 outline-none"
              />
              <button
                onClick={() => {
                  if (callInputRef.current.value) {
                    navigator.clipboard.writeText(callInputRef.current.value);
                    toast.success("Meeting ID copied to clipboard");
                  }
                }}
              >
                <img src="/copy.svg" className="h-5 w-5 m-2 mr-4" />
              </button>
            </div>

            <button
              ref={hangupButtonRef}
              onClick={handleHangupClick}
              className="py-2 px-4 bg-red-500 text-white rounded-xl m-2 w-max mx-auto shadow-md"
            >
              Hang Up
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center h-[calc(100vh-5rem)] p-8">
          <div>
            <div>
              <span className="font-bold">Transcript</span> :
            </div>
            <Markdown children={transcripted.transcript} />
            <div className="h-8"></div>
            <div>
              <span className="font-bold">Tasks</span> :
            </div>
            <Markdown children={transcripted.summary} />
          </div>
        </div>
      )}
    </>
  );
}
