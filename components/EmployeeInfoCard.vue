<template>
  <v-card
    outlined
    :hover="true"
    @keypress.enter="showInfo(data)"
    @click="showInfo(data)"
  >
    <v-card-title class="text-capitalize">{{ data.name }}</v-card-title>
    <v-card-subtitle class="py-0 text-capitalize">
      Father name - {{ data.fatherName }}
    </v-card-subtitle>
    <v-card-subtitle class="pt-0 text-capitalize">
      Role - {{ data.role }}
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
