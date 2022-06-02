<template>
  <v-card
    outlined
    :hover="true"
    @keypress.enter="showGroupInfo(data)"
    @click="showGroupInfo(data)"
  >
    <v-card-title class="text-capitalize"
      >Group Name - {{ data.groupId.name }}</v-card-title
    >
    <v-card-subtitle class="text-capitalize"
      >Group Address - {{ data.groupId.address }}</v-card-subtitle
    >
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
