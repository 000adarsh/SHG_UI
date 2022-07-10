<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <div class="pb-3">
      <h3 class="text-center">Group Details</h3>
      <v-divider></v-divider>
    </div>
    <div class="py-2">
      <v-row>
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click.prevent="
              $router.push(
                `/group/${$route.params.group}/details?name=${$route.query.name}`
              )
            "
            ><h1>Group Details</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click.prevent="
              $router.push(
                `/group/${$route.params.group}/fundings?name=${$route.query.name}`
              )
            "
            ><h1>Fundings</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/loans?name=${$route.query.name}`
              )
            "
            ><h1>Loans</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/savings?name=${$route.query.name}`
              )
            "
            ><h1>Savings</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/users?name=${$route.query.name}`
              )
            "
            ><h1>Users</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/dairy?name=${$route.query.name}`
              )
            "
            ><h1>Dairy</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/loanInstallments?name=${$route.query.name}`
              )
            "
            ><h1>Loans Installments</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/bankTransactions?name=${$route.query.name}`
              )
            "
            ><h1>Bank Transactions</h1></v-card
          ></v-col
        >
      </v-row>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
export default {
  name: 'GroupPage',
  middleware: authRouter,
}
</script>

<style></style>
