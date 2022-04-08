<template>
  <div>
    <v-card-actions
      ><v-spacer></v-spacer
      ><v-btn text outlined color="primary"
        >edit group permission</v-btn
      ></v-card-actions
    >
    <div class="py-2 text-center">
      <h3>Employee Group Permissions</h3>
      <v-divider></v-divider>
    </div>
  </div>
</template>
<script>
import authRouter from '~/middleware/authRouter'
export default {
  name: 'EmployeeGroupPermissionPage',
  middleware: authRouter,
}
</script>

<style></style>
