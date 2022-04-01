<template>
  <div>
    <h3 class="text-center">Group Fundings</h3>
    <v-divider></v-divider>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
export default {
  name: 'GroupFundings',
  middleware: authRouter,
}
</script>

<style></style>
