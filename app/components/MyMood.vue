<template>
  <StackLayout>
    <Label class="action-bar" text="My Mood"></Label>
    <ScrollView class="card">
      <StackLayout>
        <Label
          horizontalAlignment="center"
          textWrap="true"
          class="title"
        >Take a Selfie and Match your Mood to a Poem</Label>
        <StackLayout row="1">
          <Button class="mini-card indigo" text="Take a Pic" @tap="runFaceDetect" />
          <Image class="cameraPic rose" :src="selfie"></Image>
          <Label v-for="emotion in emotions" :key="emotion">{{ emotion }}</Label>
        </StackLayout>
        <StackLayout class="inner-card" v-if="selfiePoem">
          <Label textWrap="true" :text="selfiePoem" />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </StackLayout>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { takePicture, requestCameraPermissions } from "nativescript-camera";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";
import { ImageSource } from "tns-core-modules/image-source";
import { File, knownFolders, path } from "tns-core-modules/file-system";
import { isAndroid } from "tns-core-modules/platform";
import { session } from "nativescript-background-http";

const http = require("http");
export default {
  data() {
    return {
      selfie: "",
      result: [],
      emotions: [],
      myEmotion: 0.5
    };
  },
  computed: {
    ...mapState(["selfiePoem"])
  },
  methods: {
    ...mapActions(["getSelfiePoem", "clearSelfiePoem"]),
    async runFaceDetect() {
      this.clearSelfiePoem();
      const imageAsset = await takePicture({
        width: 300,
        height: 500,
        keepAspectRatio: true,
        saveToGallery: false,
        cameraFacing: "front"
      });
      //process the asset
      const filePath = await this.getFilePath(imageAsset);
      const imageFile = File.fromPath(filePath);
      this.selfie = imageAsset;
      //send it to be processed
      this.result = await this.sendRequest(imageFile);
    },

    async getFilePath(asset) {
      if (isAndroid) {
        return asset.android;
      }

      const source = await new ImageSource().fromAsset(asset);

      const folder = knownFolders.documents().path;
      const fileName = `${Date.now()}.png`;
      const filePath = path.join(folder, fileName);
      const saved = source.saveToFile(filePath, "png");
      if (saved) {
        console.log("Image ready for upload!");
      }

      return filePath;
    },

    determineScore(score) {
      const myScore = score.split("-");
      const mood = myScore[1].trim();
      switch (mood) {
        case "sadness":
          this.myEmotion = 0.1;
          break;
        case "anger":
          this.myEmotion = 0.2;
          break;
        case "contempt":
          this.myEmotion = 0.3;
          break;
        case "disgust":
          this.myEmotion = 0.3;
          break;
        case "fear":
          this.myEmotion = 0.4;
          break;
        case "neutral":
          this.myEmotion = 0.5;
          break;
        case "happiness":
          this.myEmotion = 0.7;
          break;
        case "surprise":
          this.myEmotion = 0.8;
          break;
        default:
          this.myEmotion = 0.5;
          break;
      }
      this.getSelfiePoem(this.myEmotion);
    },

    sendRequest(file) {
      return new Promise((resolve, reject) => {
        const ses = session("image-upload");

        const request = {
          url:
            "https://emilyemotions.cognitiveservices.azure.com/face/v1.0/detect?returnFaceLandmarks=false&returnFaceAttributes=emotion",
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": "your-key"
          },
          description: "Uploading " + file.name
        };

        const task = ses.uploadFile(file.path, request);

        task.on("error", e => reject("error " + e.responseCode + " code."));

        task.on("responded", e => {
          //clear the array
          this.emotions = [];
          const data = JSON.parse(e.data);
          const emotion = data[0].faceAttributes.emotion;

          for (var i in emotion) this.emotions.push(emotion[i] + " - " + i);

          this.emotions.sort(function(a, b) {
            return parseFloat(b) - parseFloat(a);
          });
          //grab the top element and equate it to a poem score
          this.determineScore(this.emotions[0]);
        });
      });
    }
  }
};
</script>

<style scoped>
.cameraPic {
  border-radius: 5;
  margin: 10;
}
</style>