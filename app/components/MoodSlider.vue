<template>
  <StackLayout>
    <Label class="action-bar" text="Mood Slider"></Label>
    <ScrollView class="card">
      <StackLayout>
        <Label
          horizontalAlignment="center"
          textWrap="true"
          class="title"
        >Slide the slider to choose a matching poem</Label>
        <Label :text="value" />
        <Slider
          borderWidth="5"
          margin="5"
          color="#00416a"
          backgroundColor="#00416a"
          minValue="0"
          maxValue="1"
          :value="value"
          @valueChange="onValueChanged($event.value)"
        />
        <Button @tap="selectPoem" text="Match My Mood" class="mini-card indigo" />
        <StackLayout v-if="showCard" :class="moodClass">
          <Label textWrap="true" :text="moodPoem" />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </StackLayout>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      value: 0.5,
      moodClass: "inner-card",
      showCard: false
    };
  },
  computed: {
    ...mapState(["moodPoem"])
  },
  methods: {
    ...mapActions(["getMoodPoem", "clearMoodPoem"]),
    onValueChanged(e) {
      this.showCard = true;
      this.clearMoodPoem();
      this.value = e.toFixed(2);
      if (this.value < 0.5) {
        this.moodClass = "inner-card blue";
      } else {
        this.moodClass = "inner-card rose";
      }
    },
    selectPoem() {
      this.getMoodPoem(this.value);
    },
    created() {
      this.getMoodPoem(0.5);
    }
  }
};
</script>
