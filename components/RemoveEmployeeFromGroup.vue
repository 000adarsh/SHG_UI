<template>
  <div>
    <v-container
      ><v-card>
        <v-card-text>
          <div class="text-center">
            <h3>Add employee to group</h3>
            <v-divider></v-divider>
          </div>
          <div>
            <v-autocomplete
              v-model="values"
              :items="items"
              outlined
              label="Select Group"
            ></v-autocomplete>
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
    data: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      groups: {},
      values: null,
      items: [],
    }
  },
  mounted() {
    this.data.forEach((e) => {
      this.items.push(e.groupId.name)
      this.groups[e.groupId.name] = e.groupId.id
    })
  },
  methods: {
    submit() {
      this.$emit('submit', { groupId: this.groups[this.values] })
    },
  },
}
</script>
