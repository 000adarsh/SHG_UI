<template>
  <v-card
    outlined
    :hover="true"
    class="pl-4 py-1 text-capitalize"
    @keypress.enter="showInfo(data)"
    @click="showInfo(data)"
  >
    <h3>{{ data.name }}</h3>
    <h4 class="text--secondary">Father name - {{ data.fatherName }}</h4>
    <h4 class="text--secondary">Role - {{ data.role }}</h4>
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
    showInfo(data) {
      this.$emit('ok', data)
    },
  },
}
</script>

<style></style>
