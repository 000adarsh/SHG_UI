<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <div class="pb-2">
      <h3 class="text-center">Employee Details</h3>
      <v-divider></v-divider>
    </div>
    <div class="py-2">
      <v-row
        ><v-col class="py-1" cols="12" sm="6" lg="4"
          ><v-card
            outlined
            :hover="true"
            @keypress.enter="
              $router.push(
                `/employees/${$route.params.employee}/details?name=${$route.query.name}`
              )
            "
            @click="
              $router.push(
                `/employees/${$route.params.employee}/details?name=${$route.query.name}`
              )
            "
            ><h1 class="text-center">Employee Details</h1></v-card
          ></v-col
        ><v-col class="py-1" cols="12" sm="6" lg="4"
          ><v-card
            outlined
            :hover="true"
            @keypress.enter="
              $router.push(
                `/employees/${$route.params.employee}/employeePermission?name=${$route.query.name}`
              )
            "
            @click="
              $router.push(
                `/employees/${$route.params.employee}/employeePermission?name=${$route.query.name}`
              )
            "
            ><h1 class="text-center">Permission</h1></v-card
          ></v-col
        ><v-col class="py-1" cols="12" sm="6" lg="4"
          ><v-card
            outlined
            :hover="true"
            @keypress.enter="
              $router.push(
                `/employees/${$route.params.employee}/group?name=${$route.query.name}`
              )
            "
            @click="
              $router.push(
                `/employees/${$route.params.employee}/group?name=${$route.query.name}`
              )
            "
            ><h1 class="text-center">Group Permission</h1></v-card
          ></v-col
        ></v-row
      >
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'

export default {
  name: 'EmployeeDetailsPage',

  middleware: authRouter,
}
</script>

<style></style>
