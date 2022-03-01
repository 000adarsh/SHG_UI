<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template #append>
        <div class="pa-2 d-flex justify-space-between">
          <v-btn color="primary" text outlined @click="changeTheme">
            {{ $vuetify.theme.isDark ? 'Light' : 'Dark' }}
          </v-btn>
          <v-btn v-if="isLogin" color="error" text outlined @click="logOut">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app short>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <Notification />
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <div class="mx-auto">
        <p class="text-center">
          &copy; {{ new Date().getFullYear() }} This site is made by ❤

          <a
            href="https://inflection.org.in"
            target="_blank"
            class="text-md hover:underline font-semibold text-primary"
          >
            Inflection ORG</a
          >
          | All rights reserved
        </p>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import { deleteCookie, getCookie } from '~/utils/manageCookies'
import FetchService from '~/services/FetchService'
import Notification from '~/components/Notification.vue'
export default {
  name: 'DefaultLayout',
  components: {
    Notification,
  },
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      isLogin: false,
      title: 'SHG',
      items: [
        {
          icon: 'mdi-creation',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-login',
          title: 'Login',
          to: '/auth',
        },
        {
          icon: 'mdi-login-variant',
          title: 'Signup',
          to: '/auth/signup',
        },
        {
          icon: 'mdi-account',
          title: 'Employees',
          to: '/employees',
        },
      ],
    }
  },
  created() {
    FetchService.setAuthHeader()
    this.updateLoginStatus()
  },
  updated() {
    this.updateLoginStatus()
  },
  methods: {
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.isDark
    },
    logOut() {
      deleteCookie('token')
      this.updateLoginStatus()
      this.$router.push('/auth')
    },
    updateLoginStatus() {
      this.isLogin = getCookie('token')
    },
  },
}
</script>
