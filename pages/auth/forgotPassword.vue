<template>
  <v-container>
    <v-card class="mx-auto" style="max-width: 500px">
      <v-list-item-content class="justify-center">
        <div class="text-center">
          <v-avatar size="80">
            <v-img :src="require('@/assets/logo.png')"></v-img>
          </v-avatar>
          <h3 class="mt-2">ForgotPassword</h3>
          <v-divider class="mt-1"></v-divider></div
      ></v-list-item-content>
      <v-form ref="form" v-model="valid" class="px-4">
        <v-text-field
          v-model="email"
          prepend-icon="mdi-account"
          outlined
          filled
          :rules="[
            (email) => /.+@.+\..+/.test(email) || 'Enter a valid email ',
          ]"
          required
          color="info"
          label="Email"
        ></v-text-field>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          outlined
          color="success"
          :loading="isLoading"
          :disabled="!valid"
          @click="forgotPassword"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import FetchService from '~/services/FetchService'
export default {
  name: 'ForgotPassword',
  data() {
    return {
      valid: false,
      isLoading: false,
      email: null,
    }
  },
  methods: {
    async forgotPassword() {
      this.isLoading = true
      const forgotPassword = await FetchService.forgotPassword({
        email: this.email,
      })
      // show notification in notification bar
      if (forgotPassword) {
        this.$root.$emit('showNotification', forgotPassword)
      }
      if (forgotPassword.data.status !== 'success') {
        this.isLoading = false
        return
      }
      this.$router.push('/auth')
    },
  },
}
</script>

<style></style>
