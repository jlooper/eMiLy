<template>
  <StackLayout>
    <Label class="action-bar" text="Discover New Poetry"></Label>

    <ScrollView class="card">
      <StackLayout>
        <Label horizontalAlignment="center" textWrap="true" class="title">New Poetry</Label>
        <Image src="~/assets/logo.png" width="400px" />
        <StackLayout class="inner-card">
          <Label textWrap="true" :text="newPoem" />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </StackLayout>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["newPoem"])
  },
  methods: {
    ...mapActions(["getNewPoem"])
  },
  created() {
    this.getNewPoem();
  }
};
</script>
