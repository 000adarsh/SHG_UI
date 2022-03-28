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
      <h3 class="text-center">Group Details</h3>
      <v-divider></v-divider>
      <v-simple-table v-if="group">
        <tbody>
          <tr>
            <td>Group Name</td>
            <td>{{ group.name }}</td>
          </tr>
          <tr>
            <td>Group Address</td>
            <td>{{ group.address }}</td>
          </tr>
          <template v-if="showDetails">
            <tr>
              <td>Group Saving Amount</td>
              <td>{{ group.savingAmount }}</td>
            </tr>
            <tr>
              <td>Saving Type</td>
              <td>{{ group.savingType }}</td>
            </tr>
            <tr>
              <td>Group Loan Interest</td>
              <td>{{ group.loanInterestPercentage }}</td>
            </tr>
            <tr>
              <td>Loan Type</td>
              <td>{{ group.loanInterestType }}</td>
            </tr>
          </template>
        </tbody>
      </v-simple-table>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          icon
          color="primary"
          outlined
          @click="showDetails = !showDetails"
        >
          <v-icon>{{
            showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'
          }}</v-icon>
        </v-btn>
      </v-card-actions>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'GroupPage',
  middleware: authRouter,
  data() {
    return {
      group: null,
      editEmployeeDetails: false,
      showDetails: false,
    }
  },
  async created() {
    await this.getGroup(this.$route.params.group)
  },
  methods: {
    async getGroup(id) {
      const group = await FetchService.getGroup({ groupId: id })
      if (group) {
        this.$root.$emit('showNotification', group)
      }
      if (group.data.status === 'success') {
        this.group = group.data.group
      }
    },
  },
}
</script>

<style></style>
