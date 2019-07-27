<template>
  <Page class="page" actionBarHidden="true">
    <GridLayout rows="*,auto" columns="*">
      <!-- main components all on top of each other, since only 1 will be visible at any given time -->
      <component
        v-for="component in componentsArray"
        v-show="component === currentComponent"
        :key="component"
        :is="component"
        row="0"
        col="0"
      />
      <GridLayout row="1" col="0" rows="*" columns="*,*,*,*">
        <!-- Bottom navigation -->
        <StackLayout row="0" col="0" :class="navigationButtonClasses('DailyPoem')">
          <Image @tap="currentComponent = 'DailyPoem'" src="~/assets/pencil.png" height="30" />
        </StackLayout>

        <StackLayout row="0" col="1" :class="navigationButtonClasses('MoodSlider')">
          <Image @tap="currentComponent = 'MoodSlider'" src="~/assets/adjustments.png" height="30" />
        </StackLayout>

        <StackLayout row="0" col="2" :class="navigationButtonClasses('MyMood')">
          <Image @tap="currentComponent = 'MyMood'" src="~/assets/profile-female.png" height="30" />
        </StackLayout>

        <StackLayout row="0" col="3" :class="navigationButtonClasses('NewPoetry')">
          <Image @tap="currentComponent = 'NewPoetry'" src="~/assets/telescope.png" height="30" />
        </StackLayout>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
import DailyPoem from "../components/DailyPoem";
import MyMood from "../components/MyMood";
import MoodSlider from "../components/MoodSlider";
import NewPoetry from "../components/NewPoetry";

export default {
  data() {
    return {
      currentComponent: "DailyPoem",
      componentsArray: ["DailyPoem", "MyMood", "MoodSlider", "NewPoetry"]
    };
  },
  computed: {
    navigationButtonClasses() {
      return component => ({
        "nav-btn": true,
        colored: component === this.currentComponent
      });
    }
  },

  components: {
    DailyPoem,
    MyMood,
    MoodSlider,
    NewPoetry
  }
};
</script>

