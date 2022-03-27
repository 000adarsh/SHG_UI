<template>
  <div>
    <v-card-actions>
      <v-btn color="primary" outlined @click="editEmployeeDetails = true">
        edit details
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" outlined> edit permissions </v-btn>
    </v-card-actions>
    <div class="py-3"></div>
    <div class="py-3">
      <h3 class="text-center">Employee Details</h3>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupPage',
}
</script>

<style></style>
