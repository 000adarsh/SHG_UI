<template>
  <div>
    <h3 class="text-center">Group Savings</h3>
    <v-divider></v-divider>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
export default {
  name: 'GroupSavings',
  middleware: authRouter,
}
</script>

<style></style>
