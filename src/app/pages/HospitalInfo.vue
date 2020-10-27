<template>
  <div>
    <hospital-card :hospital="hospital" to="">
      <div v-if="!submitted">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-title> Contact </v-card-title>
          <v-list-item>
            <v-text-field
              :rules="rules"
              label="Subject"
              v-model="subjectModel"
              @change="resetValidation"
            />
          </v-list-item>
          <v-list-item>
            <v-text-field
              :rules="emailRules"
              label="Email"
              @change="resetValidation"
            />
          </v-list-item>
          <v-list-item>
            <v-text-field
              :rules="rules"
              label="Message"
              @change="resetValidation"
            />
          </v-list-item>
          <v-list-item>
            <v-text-field
              :rules="rules"
              label="Inquiry"
              v-model="hospital.name"
              @change="resetValidation"
            />
          </v-list-item>
          <v-list-item>
            <v-btn
              :disabled="!valid"
              depressed
              color="primary"
              @click="validate"
            >
              Submit
            </v-btn>
          </v-list-item>
        </v-form>
      </div>
      <div v-else>
        <v-card-title> Submitted Successfully! </v-card-title>
      </div>
    </hospital-card>
  </div>
</template>
<script>
import HospitalCard from "../components/HospitalCard.vue"
import { fetchHospitals } from "../../model/api/hospital"

export default {
  name: "hospital-info-page",

  components: {
    HospitalCard,
  },

  data() {
    const activeHospital = this.$store.state.activeHospital
    return {
      submitted: false,
      valid: true,
      rules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 3) || "Min 3 characters",
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      subjectModel:
        "Regarding: " +
        (this.hospital?.name ||
          this.$store.state.hospitals[activeHospital]?.name),
      hospital: {
        id:
          this.hospital?.id || this.$store.state.hospitals[activeHospital]?.id,
        name:
          this.hospital?.name ||
          this.$store.state.hospitals[activeHospital]?.name,
        address:
          this.hospital?.address ||
          this.$store.state.hospitals[activeHospital]?.address,
        phoneNumber:
          this.hospital?.phoneNumber ||
          this.$store.state.hospitals[activeHospital]?.phoneNumber,
      },
    }
  },

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.submitted = true
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  },

  async asyncData({ store, route }) {
    const id = route?.params?.id

    if (!store.state.hospitals[id]) {
      return store.dispatch("FETCH_HOSPITALS").then(() => {
        store.dispatch({ type: "SET_ACTIVE_HOSPITAL", id: route?.params?.id })
      })
    }

    return store.dispatch({ type: "SET_ACTIVE_HOSPITAL", id: route?.params?.id })
  },
}
</script>
