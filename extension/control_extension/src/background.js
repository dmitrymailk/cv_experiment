import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "./libs/@mediapipe/camera_utils";

chrome.browserAction.onClicked.addListener(() => {
  console.log("click");
  function onResultsConsole(results) {
    if (results.multiHandLandmarks) console.log(results.multiHandLandmarks);
  }
  let loadedFiles = 0;
  const hands = new Hands({
    locateFile: (file) => {
      console.log(file);
      const filename = `./hands_lib/${file}`;
      //   const filename = `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      loadedFiles += 1;
      if (loadedFiles > 4) window.interval_time = 1000 / 60;
      //   if (!window[filename]) {
      //     window[filename] = filename;
      return filename;
    },
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 0,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onResultsConsole);

  window.hands = hands;

  const videoElement = document.createElement("video");
  const camera = new Camera(videoElement, {
    onFrame: async () => {
      //   console.warn("videoElement", videoElement);
      await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
  });
  window.camera = camera;
  camera.start();
});
