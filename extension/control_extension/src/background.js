import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "./libs/@mediapipe/camera_utils";
const PI = 3.14159265359;
import * as tf from "@tensorflow/tfjs";

chrome.browserAction.onClicked.addListener(() => {});
console.log("click");

function getTensors(tensors, indices) {
  let coordsTensor = [];
  for (let i = 0; i < indices.length; i++)
    coordsTensor.push(tensors[indices[i]]);

  return tf.tensor(coordsTensor);
}

function radians2degrees(tensor) {
  return tensor.mul(180 / PI);
}

function onResultsConsole(results) {
  if (results.multiHandLandmarks) {
    // console.log(results.multiHandLandmarks);

    let landMarks = results.multiHandLandmarks;
    if (landMarks.length == 1) {
      landMarks = landMarks[0];
      let pointCoordinates = [];
      for (let i = 0; i < landMarks.length; i++) {
        pointCoordinates.push([landMarks[i].x, landMarks[i].y, landMarks[i].z]);
      }
      //   console.log(pointCoordinates);
      const tensors = tf.tensor(pointCoordinates);
      let coords1 = [
        0, 1, 2, 3, 0, 5, 6, 7, 0, 9, 10, 11, 0, 13, 14, 15, 0, 17, 18, 19,
      ];
      let coords2 = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ];
      let v1 = getTensors(pointCoordinates, coords1);
      let v2 = getTensors(pointCoordinates, coords2);

      let v = tf.add(v2, tf.neg(v1));
      let temp = tf.expandDims(tf.norm(v, 2, 1), 1);
      temp.print();
      v = tf.div(v, temp);
      v.print();

      coords1 = [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18];
      coords2 = [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19];
      v1 = getTensors(v.arraySync(), coords1);
      v2 = getTensors(v.arraySync(), coords2);

      let angle = radians2degrees(tf.acos(tf.sum(tf.mul(v1, v2), 1)));
      angle.print();
      // просто переделываем изначальный массив так чтобы было удобно перемножить
    }
  }
}
let loadedFiles = 0;
const hands = new Hands({
  locateFile: (file) => {
    console.log(file);
    const filename = `./hands_lib/${file}`;
    //   const filename = `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    loadedFiles += 1;
    //   if (loadedFiles > 4) window.interval_time = 1000 / 60;
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
