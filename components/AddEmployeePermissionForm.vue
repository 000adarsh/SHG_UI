<template>
  <div>
    <v-container
      ><v-card>
        <v-card-text>
          <div class="text-center py-2">
            <h3>Add Employee Permissions</h3>
            <v-divider></v-divider>
          </div>
          <div>
            <v-select
              v-model="values"
              :items="items"
              multiple
              chips
              single-line
              outlined
              label="Select Group"
            ></v-select>
          </div>
          <v-card-actions
            ><v-spacer></v-spacer>
            <v-btn text outlined color="success" @click="$emit('closeDialog')"
              >close</v-btn
            >
            <v-btn
              text
              outlined
              color="error"
              :disabled="!values"
              :loading="loading"
              @click="submit"
              >ok</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card></v-container
    >
  </div>
</template>

<script>
export default {
  props: {
    myPermissions: {
      type: Object,
      required: true,
    },
    permissions: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      makePermissions: {},
      values: [],
      items: [],
    }
  },
  mounted() {
    Object.keys(this.myPermissions).forEach((e) => {
      const notGiven = Object.keys(this.permissions)
      if (!notGiven.includes(e)) {
        this.items.push(this.myPermissions[e])
      }
      this.makePermissions[this.myPermissions[e]] = e
    })
  },
  methods: {
    submit() {
      const selectedPermissions = {}
      this.values.forEach((e) => {
        selectedPermissions[this.makePermissions[e]] = 0
      })
      this.$emit('submit', { permissions: selectedPermissions })
    },
  },
}
</script>

<style></style>
