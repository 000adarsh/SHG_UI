<template>
  <v-card outlined :hover="true" @click="showInfo(data)">
    <v-card-title>{{ data.name }}</v-card-title>
    <v-card-subtitle class="py-0">
      Father name - {{ data.fatherName }}
    </v-card-subtitle>
    <v-card-subtitle class="py-0"> Role - {{ data.role }} </v-card-subtitle>
    <v-card-subtitle class="pt-0">
      Address - {{ data.address }}
    </v-card-subtitle>
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
      this.$router.push(`/employees/${data.id}`)
    },
  },
}
</script>

<style></style>
