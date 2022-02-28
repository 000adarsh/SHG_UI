<template>
  <v-container class="pa-0">
    <v-card class="mx-auto" style="max-width: 600px">
      <v-list-item-content class="justify-center">
        <div class="mx-auto text-center">
          <v-avatar size="80">
            <v-img :src="require('@/assets/logo.png')"></v-img>
          </v-avatar>
          <h3 class="mt-2">Signup</h3>
          <v-divider class="mt-1"></v-divider>
        </div>
      </v-list-item-content>
      <v-form ref="signupForm" v-model="valid" class="px-4">
        <v-text-field
          v-model="email"
          prepend-icon="mdi-email"
          outlined
          filled
          :rules="[
            (email) => /.+@.+\..+/.test(email) || 'Enter a valid email ',
          ]"
          required
          color="info"
          label="Email*"
        ></v-text-field>
        <v-text-field
          v-model="name"
          prepend-icon="mdi-account"
          outlined
          filled
          :rules="[
            (name) =>
              (!!name && name.length > 4) || 'Name greater than 4 word ',
          ]"
          required
          color="info"
          label="Name*"
        ></v-text-field>
        <v-text-field
          v-model="fatherName"
          prepend-icon="mdi-account"
          outlined
          filled
          :rules="[
            (fatherName) =>
              (!!fatherName && fatherName.length > 4) ||
              'Father Name is greater than 4 word',
          ]"
          required
          color="info"
          label="Father Name*"
        ></v-text-field>
        <v-text-field
          v-model="address"
          prepend-icon="mdi-home"
          outlined
          filled
          :rules="[
            (address) =>
              (!!address && address.length > 2) ||
              'Address is greater than 5 word ',
          ]"
          required
          color="info"
          label="Address*"
        ></v-text-field>
        <v-text-field
          v-model="phone"
          prepend-icon="mdi-phone"
          outlined
          filled
          counter
          type="number"
          :rules="[
            (phone) =>
              (!!phone && phone.length === 10) || 'Enter a valid mobile no ',
          ]"
          required
          color="info"
          label="Mobile No*"
        ></v-text-field>
        <v-text-field
          v-model="alternativePhone"
          prepend-icon="mdi-phone"
          outlined
          filled
          counter
          type="number"
          :rules="[
            (alternativePhone) =>
              (!!alternativePhone && alternativePhone.length === 10) ||
              'Enter a valid alternative mobile no ',
          ]"
          color="info"
          label="Alternative Mobile No"
        ></v-text-field>
      </v-form>
      <v-card-subtitle class="pt-0">* fields are compulsory</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn text outlined color="error" @click="$refs.signupForm.reset()">
          Clear
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          text
          outlined
          color="success"
          :loading="isLoading"
          :disabled="!valid"
          @click="signup"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'SignUp',
  middleware: authRouter,
  data() {
    return {
      valid: false,
      isLoading: false,
      email: null,
      name: null,
      fatherName: null,
      address: null,
      phone: null,
      alternativePhone: null,
    }
  },
  methods: {
    async signup() {
      this.isLoading = true
      const signup = await FetchService.signup({
        email: this.email,
        name: this.name,
        fatherName: this.fatherName,
        address: this.address,
        phone: this.phone,
        alternativePhone: this.alternativePhone,
      })
      if (signup) {
        this.$root.$emit('showNotification', signup)
      }
      if (signup.data.status !== 'success') {
        this.isLoading = false
        return
      }
      this.$refs.signupForm.reset()
      this.isLoading = false
    },
  },
}
</script>

<style></style>
