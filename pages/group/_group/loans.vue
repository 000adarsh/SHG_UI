<template>
  <div>
    <h3 class="text-center">Group Loans</h3>
    <v-divider></v-divider>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
export default {
  name: 'GroupLoans',
  middleware: authRouter,
}
</script>

<style></style>
