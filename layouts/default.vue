<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      class="d-flex d-md-none d-lg-none d-xl-none"
      :clipped="clipped"
      fixed
      app
    >
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

        <div class="my-5">
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
      </template>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app short>
      <v-app-bar-nav-icon
        class="d-flex d-md-none d-lg-none d-xl-none"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title
        :hover="true"
        @click="$router.replace('/')"
        v-text="title"
      />
      <v-row>
        <v-spacer></v-spacer>
        <div class="pt-3 d-none d-md-flex d-lg-flex d-xl-flex">
          <div v-for="(item, i) in links" :key="i">
            <nuxt-link
              :to="item.to"
              class="mx-2 font-weight-bold"
              style="text-decoration: none"
              >{{ item.title }}</nuxt-link
            >
          </div>
        </div>
        <v-btn
          icon
          class="ml-2 d-none d-md-flex d-lg-flex d-xl-flex"
          @click="changeTheme"
          ><v-icon>mdi-invert-colors</v-icon></v-btn
        >
        <v-btn v-if="deferredInstall" icon class="mr-4 ml-2" @click="pwaInstall"
          ><v-icon>mdi-download</v-icon></v-btn
        >
      </v-row>
    </v-app-bar>
    <v-main>
      <v-container>
        <Notification />
        <Nuxt />
      </v-container>
    </v-main>
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
      deferredInstall: null,
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
          icon: 'mdi-account-hard-hat',
          title: 'Employees',
          to: '/employees',
        },
        {
          icon: 'mdi-account-supervisor-circle',
          title: 'Groups',
          to: '/group',
        },
        {
          icon: 'mdi-account-supervisor',
          title: 'Users',
          to: '/users',
        },
        {
          icon: 'mdi-button-pointer',
          title: 'Admin Panel',
          to: '/adminPanel',
        },
      ],
    }
  },
  computed: {
    links() {
      const a = this.items.slice().reverse()
      a.pop()
      return a
    },
  },
  created() {
    this.findTheme()
    FetchService.setAuthHeader()
    this.updateLoginStatus()
  },
  updated() {
    this.updateLoginStatus()
  },
  mounted() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredInstall = e
    })
    window.addEventListener('appinstalled', (e) => {
      this.deferredInstall = null
    })
  },
  methods: {
    pwaInstall() {
      if (this.deferredInstall) {
        this.deferredInstall.prompt()
        this.deferredInstall.userChoice.then((choice) => {
          if (choice.outcome === 'accepted') {
            this.$root.$emit('showNotification', {
              data: {
                status: 'success',
                message: 'App installed successfully',
              },
            })
          }
        })
      }
    },
    findTheme() {
      if (localStorage.theme === 'dark') {
        this.$vuetify.theme.dark = true
      }
      if (localStorage.theme === 'light') {
        this.$vuetify.theme.dark = false
      }
    },
    changeTheme() {
      if (localStorage.theme === 'light') {
        localStorage.theme = 'dark'
        this.$vuetify.theme.dark = true
      } else {
        localStorage.theme = 'light'
        this.$vuetify.theme.dark = false
      }
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
