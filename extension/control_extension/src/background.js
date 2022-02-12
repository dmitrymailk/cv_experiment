import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

chrome.browserAction.onClicked.addListener(() => {
  console.log("click");
  function onResultsConsole(results) {
    if (results.multiHandLandmarks) console.log(results.multiHandLandmarks);
  }

  const hands = new Hands({
    locateFile: (file) => {
      console.log(file);
      return `./hands_lib/${file}`;
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
      console.warn("videoElement", videoElement);
      await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
  });
  window.camera = camera;
  camera.start();
});
