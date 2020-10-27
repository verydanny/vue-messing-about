<template>
  <v-card class="mx-auto mb-6">
    <router-link :to="to">
      <v-card-text>
        <p class="dispaly-1 text--primary">{{ name }}</p>
        <div class="text--primary">{{ address }}</div>
      </v-card-text>
    </router-link>
    <v-card-actions>
      <v-btn text color="deep-purple accent-4" :href="`tel:${phoneNumber}`"
        >Tels: {{ phoneNumber }}</v-btn
      >
    </v-card-actions>
    <slot />
  </v-card>
</template>

<script>
export default {
  name: "hospital-card",

  props: ["hospital", "to"],

  data() {
    const activeHospital = this.$store.state.activeHospital
    return {
      id: this.hospital?.id || this.$store.state.hospitals[activeHospital]?.id,
      name:
        this.hospital?.name ||
        this.$store.state.hospitals[activeHospital]?.name,
      address:
        this.hospital?.address ||
        this.$store.state.hospitals[activeHospital]?.address,
      phoneNumber:
        this.hospital?.phoneNumber ||
        this.$store.state.hospitals[activeHospital]?.phoneNumber,
    }
  },

  async asyncData({ store, route }) {
    return store.dispatch("FETCH_HOSPITALS").then(() => {
      store.dispatch({ type: "SET_ACTIVE_HOSPITAL", id: route?.params?.id })
    })
  },
}
</script>
