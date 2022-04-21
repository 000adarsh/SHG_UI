<template>
  <div>
    <div v-for="(n, i) in notifications" :key="i">
      <v-snackbar
        v-model="snackbar"
        top
        dark
        elevation="24"
        :color="isSuccess ? 'success' : 'error'"
        :timeout="timeout"
        >{{ n.message }}
        <template #action="{ attrs }">
          <v-btn
            color="info"
            text
            dark
            outlined
            v-bind="attrs"
            @click="closeNotification"
          >
            Close
          </v-btn>
        </template></v-snackbar
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationPage',
  data() {
    return {
      snackbar: false,
      isSuccess: false,
      notifications: [],
      timeout: 2000,
    }
  },
  mounted() {
    this.$root.$on('showNotification', (a) => {
      this.snackbar = true
      this.notifications = []
      this.isSuccess = false
      if (a.data.status === 'success') {
        this.isSuccess = true
      }
      this.notifications.push({
        status: a.data.status,
        message: a.data.message,
      })
    })
  },
  methods: {
    closeNotification() {
      this.snackbar = false
      this.notifications.pop()
    },
  },
}
</script>

<style></style>
