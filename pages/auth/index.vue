<template>
  <v-container class="pa-0">
    <v-card class="mx-auto" style="max-width: 500px">
      <v-list-item-content class="justify-center">
        <div class="mx-auto text-center">
          <v-avatar size="80">
            <v-img :src="require('@/assets/logo.png')"></v-img>
          </v-avatar>
          <h3 class="mt-2">Login</h3>
          <v-divider class="mt-1"></v-divider>
        </div>
      </v-list-item-content>
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

        <v-text-field
          v-model="password"
          prepend-icon="mdi-lock"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[
            (password) =>
              (!!password && password.length >= 4) ||
              'password is required and greater than 4 character',
          ]"
          :type="show ? 'text' : 'password'"
          filled
          outlined
          color="info"
          counter
          required
          label="Password"
          style="min-height: 96px"
          @click:append="show = !show"
        ></v-text-field>
      </v-form>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <div style="cursor: pointer">
          <v-card-text class="py-0" @click="forgotPassword"
            >forgot password</v-card-text
          >
        </div>
      </v-card-actions>
      <v-divider></v-divider>
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
          @click="setAuth"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { setCookie } from '~/utils/manageCookies.js'
import FetchService from '~/services/FetchService'
export default {
  name: 'LoginPage',
  data() {
    return {
      show: false,
      valid: false,
      isLoading: false,
      password: null,
      email: null,
    }
  },
  methods: {
    async setAuth() {
      this.isLoading = true
      const login = await FetchService.login({
        email: this.email,
        password: this.password,
      })
      if (login) {
        this.$root.$emit('showNotification', login)
      }
      if (login.data.status !== 'success') {
        this.isLoading = false
        return
      }
      setCookie('token', login.data.token, 1)
      FetchService.setAuthHeader()
      this.$router.push('/')
    },
    forgotPassword() {
      this.$router.push('/auth/forgotpassword')
    },
  },
}
</script>
