<template>
  <div>
    <v-card-actions
      ><v-spacer></v-spacer
      ><v-btn text outlined color="primary"
        >Add employee to group</v-btn
      ></v-card-actions
    >
    <div class="py-2 text-center">
      <h3>Employee Groups</h3>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
export default {
  name: 'EmployeeGroupPage',
  middleware: authRouter,
}
</script>

<style></style>
