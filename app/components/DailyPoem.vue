<template>
  <StackLayout>
    <Label class="action-bar" text="Discover Emily Dickinson"></Label>

    <ScrollView class="card">
      <StackLayout>
        <Label horizontalAlignment="center" textWrap="true" class="title">Welcome</Label>
        <Image src="~/assets/logo.png" width="400px" />
        <StackLayout class="inner-card">
          <Label horizontalAlignment="center" textWrap="true" class="subtitle">My Daily Poem</Label>
          <Label textWrap="true" :text="poem" />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </StackLayout>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["poem"])
  },
  methods: {
    ...mapActions(["getPoem"])
  },
  created() {
    this.getPoem();
  }
};
</script>
