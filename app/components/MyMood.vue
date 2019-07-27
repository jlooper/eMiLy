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
        <StackLayout class="card" row="1">
          <Button class="inner-card indigo" text="Take a Pic" @tap="runFaceDetect" />
          <Image class="cameraPic rose" :src="selfie"></Image>
        </StackLayout>
        <StackLayout class="inner-card">
          <Label textWrap="true" v-if="poem" :text="poem" />
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
      result: []
    };
  },
  computed: {
    //...mapState(["poem"])
  },
  methods: {
    async runFaceDetect() {
      const imageAsset = await takePicture({
        width: 300,
        height: 500,
        keepAspectRatio: true,
        saveToGallery: false
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
          const data = JSON.parse(e.data);
          console.log(JSON.stringify(data));
          //get the highest ranking emotion
          resolve(data);
        });
      });
    }
  }
};
</script>

<style scoped>
.cameraPic {
  border-radius: 5;
}
</style>