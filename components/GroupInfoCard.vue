<template>
  <div>
    <v-card outlined :hover="true" @click="showGroupInfo(data)">
      <v-card-title class="text-capitalize"
        >Group Name - {{ data.groupId.name }}</v-card-title
      >
      <v-card-subtitle class="pt-0 text-capitalize"
        >Group Address - {{ data.groupId.address }}</v-card-subtitle
      >
    </v-card>
  </div>
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
