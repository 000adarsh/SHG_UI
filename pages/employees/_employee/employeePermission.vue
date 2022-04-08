<template>
  <div>
    <v-card-actions
      ><v-spacer></v-spacer
      ><v-btn text outlined color="primary"
        >edit permission</v-btn
      ></v-card-actions
    >
    <div class="py-2 text-center">
      <h3>Employee Permissions</h3>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
export default {
  name: 'EmployeePermissionPage',
  middleware: authRouter,
}
</script>

<style></style>
