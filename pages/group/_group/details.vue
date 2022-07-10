<template>
  <div>
    <v-card-actions>
      <v-btn color="primary" text outlined @click="editGroupDetails = true">
        edit group details
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-if="editGroupDetails"
      :value="editGroupDetails"
      persistent
      max-width="900px"
    >
      <UpdateGroupForm
        :loading="loading"
        :group="group"
        @closeDialog="
          () => {
            editGroupDetails = false
          }
        "
        @submit="updateGroup"
      />
    </v-dialog>
    <div class="pt-3">
      <h3 class="text-center">Group Details</h3>
      <v-divider></v-divider>
      <v-simple-table v-if="group" dense>
        <tbody>
          <tr>
            <td>Group Name</td>
            <td class="text-capitalize">{{ group.name }}</td>
          </tr>
          <tr>
            <td>Group Address</td>
            <td class="text-capitalize">{{ group.address }}</td>
          </tr>
          <tr>
            <td>Group Saving Amount</td>
            <td>{{ group.savingAmount }}</td>
          </tr>
          <tr>
            <td>Group Loan Interest</td>
            <td>{{ group.loanInterestPercentage }} % Monthly</td>
          </tr>

          <tr>
            <td>Creater</td>
            <td class="text-capitalize">{{ group.createdBy.name }}</td>
          </tr>
          <tr>
            <td>Create Date</td>
            <td>
              {{ $moment(group ? group.startDate : '').format('DD MMM YYYY') }}
            </td>
          </tr>
          <tr>
            <td>Updater</td>
            <td class="text-capitalize">{{ group.updatedBy.name }}</td>
          </tr>
          <tr>
            <td>Update Date</td>
            <td>
              {{ $moment(group.updatedAt).format('DD MMM YYYY') }}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'

export default {
  name: 'GroupDetailsPage',
  middleware: authRouter,
  data() {
    return {
      group: null,
      editGroupDetails: false,
      loading: false,
    }
  },
  async created() {
    await this.getGroup()
  },
  methods: {
    async getGroup() {
      const group = await FetchService.getGroup({
        groupId: this.$route.params.group,
      })
      if (group) {
        this.$root.$emit('showNotification', group)
      }
      if (group.data.status === 'success') {
        this.group = group.data.group
      }
    },
    async updateGroup(payload) {
      this.loading = true
      const group = await FetchService.updateGroup({
        ...payload,
        groupId: this.$route.params.group,
      })
      if (group) {
        this.$root.$emit('showNotification', group)
      }
      if (group.data.status === 'success') {
        await this.getGroup()
        this.loading = false
        this.editGroupDetails = false
      }
      this.loading = false
    },
  },
}
</script>

<style></style>
