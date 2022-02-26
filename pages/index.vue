<template>
  <v-card class="mx-auto" style="max-width: 500px">
    <v-list-item-content class="justify-center">
      <div class="mx-auto text-center">
        <v-avatar size="80">
          <v-img :src="require('@/assets/logo.png')"></v-img>
        </v-avatar>
        <v-divider class="mt-5"></v-divider>
        <h2 class="px-5 py-10">Welcome to SHG Gaya</h2>
      </div>
    </v-list-item-content>
  </v-card>
</template>

<script>
export default {
  name: 'IndexPage',
}
</script>
