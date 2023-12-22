import { create } from "zustand";

const STORE = create((set) => ({
  host: false,
  setHost: (x) => set(() => ({ host: x })),
  recordingLocal: false,
  setRecordingLocal: (x) => set(() => ({ recordingLocal: x })),
  recordingRemote: false,
  setRecordingRemote: (x) => set(() => ({ recordingRemote: x })),
  localBlob: null,
  setLocalBlob: (x) => set(() => ({ localBlob: x })),
  remoteBlob: null,
  setRemoteBlob: (x) => set(() => ({ remoteBlob: x })),
  startTime: 0,
  setStartTime: (x) => set(() => ({ startTime: x })),
  endTime: 0,
  setEndTime: (x) => set(() => ({ endTime: x })),
  wcs: null,
  setWcs: (x) => set(() => ({ wcs: x })),
}));

export default STORE;
