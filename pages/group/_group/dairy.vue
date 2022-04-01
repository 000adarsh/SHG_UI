<template>
  <div>
    <h3 class="text-center">Group Dairy</h3>
    <v-divider></v-divider>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
export default {
  name: 'GroupDiary',
  middleware: authRouter,
}
</script>

<style></style>
