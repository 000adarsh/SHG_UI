<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>

    <div class="pb-2">
      <h3 class="text-center">User Details</h3>
      <v-divider></v-divider>
    </div>
    <div class="py-3">
      <v-row>
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/users/${$route.params.group}/${$route.params.user}/details?name=${$route.query.name}`
              )
            "
            ><h1>User Details</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/users/${$route.params.group}/${$route.params.user}/loan?name=${$route.query.name}`
              )
            "
            ><h1>User Loans</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/users/${$route.params.group}/${$route.params.user}/saving?name=${$route.query.name}`
              )
            "
            ><h1>User Savings</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="downloadUserDetailsPdf"
            ><h1>User Pdf</h1></v-card
          ></v-col
        >
      </v-row>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'UserPage',
  middleware: authRouter,
  methods: {
    async downloadUserDetailsPdf() {
      const response = await FetchService.userPdf({
        userId: this.$route.params.user,
      })
      if (response.status !== 200) {
        this.$root.$emit('showNotification', response)
        return
      }
      const fileURL = window.URL.createObjectURL(new Blob([response.data]))
      const fileLink = document.createElement('a')
      fileLink.href = fileURL
      fileLink.setAttribute('download', `${response.headers['content-type']}`)
      document.body.appendChild(fileLink)
      fileLink.click()
    },
  },
}
</script>

<style></style>
