<template>
  <v-container>
    <v-card class="mx-auto" style="max-width: 500px">
      <v-list-item-content class="justify-center">
        <div class="mx-auto text-center">
          <v-avatar size="80">
            <v-img :src="require('@/assets/logo.png')"></v-img>
          </v-avatar>
          <h3 class="mt-2">Reset Password</h3>
          <v-divider class="mt-1"></v-divider>
        </div>
      </v-list-item-content>
      <v-form ref="form" v-model="valid" class="px-4">
        <v-text-field
          v-model="password"
          prepend-icon="mdi-lock"
          :rules="[
            (password) =>
              (!!password && password.length >= 8) ||
              'password is greater than 8 character',
          ]"
          type="text"
          outlined
          color="info"
          counter
          required
          label="Password"
        ></v-text-field>
        <v-text-field
          v-model="confirmPassword"
          prepend-icon="mdi-lock"
          :rules="[
            (password) =>
              (!!password && password.length >= 8) ||
              'password is greater than 8 character',
          ]"
          type="text"
          outlined
          color="info"
          counter
          required
          label="Confirm Password"
        ></v-text-field>
        <v-card-actions>
          <v-btn text outlined color="error" @click="$refs.form.reset()">
            Clear
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            outlined
            color="success"
            :loading="isLoading"
            :disabled="!valid"
            @click="resetPassword"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import FetchService from '~/services/FetchService'
import { setCookie } from '~/utils/manageCookies'
export default {
  name: 'ResetPassword',
  data() {
    return {
      valid: false,
      password: null,
      confirmPassword: null,
      isLoading: false,
    }
  },
  methods: {
    async resetPassword() {
      this.isLoading = true
      const resetPassword = await FetchService.resetPassword({
        link: this.$route.params.resetPassword,
        password: this.password,
      })
      if (resetPassword) {
        this.$root.$emit('showNotification', resetPassword)
      }
      if (resetPassword.data.status !== 'success') {
        this.isLoading = false
        return
      }
      setCookie('token', resetPassword.data.token, 1)
      FetchService.setAuthHeader()
      this.$router.push('/')
    },
  },
}
</script>

<style></style>
