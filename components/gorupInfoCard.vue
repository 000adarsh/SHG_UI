<template>
  <v-card outlined :hover="true" @click="showGroupInfo(data)">
    <v-card-title class="text-center">{{ data.groupId.name }}</v-card-title>
    <v-card-subtitle class="pt-0">{{ data.groupId.address }}</v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    showGroupInfo(data) {
      this.$emit('ok', data)
    },
  },
}
</script>

<style></style>
