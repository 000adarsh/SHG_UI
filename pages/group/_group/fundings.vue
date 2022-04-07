<template>
  <div>
    <div>
      <h1 class="text-center">
        {{ $route.query.name.toUpperCase() }}
      </h1>
    </div>
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
