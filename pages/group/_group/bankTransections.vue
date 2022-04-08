<template>
  <div><h3>bank transections</h3></div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
export default {
  name: 'GroupBankTransections',
  middleware: authRouter,
}
</script>

<style></style>
