<template>
  <div>
    <h1>Hello world</h1>
    <video class="input_video" ref="videoElement"></video>
    <canvas
      class="output_canvas"
      width="1280px"
      height="720px"
      ref="canvasElement"
    ></canvas>
  </div>
</template>

<script>
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Camera } from "@mediapipe/camera_utils";

// import modelWeights from "@mediapipe/hands/hand_landmark_lite.tflite";

export default {
  name: "App",
  data() {
    return {
      canvasCtx: null,
      hands: null,
    };
  },
  components: {},

  methods: {
    onResults(results) {
      console.log(results);
      const canvasElement = this.$refs.canvasElement;
      const canvasCtx = this.canvasCtx;
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF0000",
            lineWidth: 2,
          });
        }
      }
      canvasCtx.restore();
    },
  },
  mounted() {
    // console.log(modelWeights);
    this.canvasCtx = this.$refs.canvasElement.getContext("2d");
    console.log(this.$refs.canvasElement.getContext("2d"));
    const hands = new Hands({
      locateFile: (file) => {
        console.log("File", file);
        return `./hands_lib/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(this.onResults);

    this.hands = hands;
    const videoElement = this.$refs.videoElement;
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });
    camera.start();
    console.log("start");
  },
};
</script>
