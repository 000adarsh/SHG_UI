<template>
  <div>
    <h3 class="text-center">Group Users</h3>
    <v-divider></v-divider>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
export default {
  name: 'GroupUsers',
  middleware: authRouter,
}
</script>

<style></style>
