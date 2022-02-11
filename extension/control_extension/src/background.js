browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Hello from the background");

  //   browser.tabs.executeScript({
  //     file: "content-script.js",
  //   });
});

import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

chrome.browserAction.onClicked.addListener(() => {
  console.log("CLICK", window);
  const onload = () => {
    console.log("loaded");
    function onResultsConsole(results) {
      console.log(results);
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

    const videoElement = window.document.createElement("video");
    const camera = new Camera({
      onFrame: async () => {
        console.log("onFrame");
        await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });
    camera.start();
  };

  window.addEventListener("DOMContentLoaded", document, onload);
  window.addEventListener("load", window, onload);
  onload();
});
