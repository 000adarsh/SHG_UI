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
      </v-row>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
export default {
  name: 'UserPage',
  middleware: authRouter,
}
</script>

<style></style>
