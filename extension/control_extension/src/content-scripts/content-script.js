console.log("Hello from the content-script");
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

function onResultsConsole(results) {
  if (results.multiHandLandmarks) console.log(results.multiHandLandmarks);
}

const hands = new Hands({
  locateFile: (file) => {
    return `./hands_lib/${file}`;
  },
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 0,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

hands.onResults(this.onResultsConsole);

const videoElement = document.createElement("video");
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});
camera.start();
