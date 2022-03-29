<template>
  <div>
    <v-card-actions>
      <v-btn color="primary" outlined @click="editEmployeeDetails = true">
        edit details
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-if="editEmployeeDetails"
      :value="editEmployeeDetails"
      persistent
      max-width="900px"
    >
      <UpdateGroupForm
        :loading="loading"
        :group="group"
        @closeDialog="
          () => {
            editEmployeeDetails = false
          }
        "
        @submit="updateGroup"
      />
    </v-dialog>
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
    <div class="py-3">
      <h3 class="text-center">Group Details</h3>
      <v-divider></v-divider>
      <v-row class="pt-2">
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click.prevent="
              $router.push(`/group/${$route.params.group}/fundings`)
            "
            ><h1>Group Fundings</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="$router.push(`/group/${$route.params.group}/loans`)"
            ><h1>Group Loans</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="$router.push(`/group/${$route.params.group}/savings`)"
            ><h1>Group Savings</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="$router.push(`/group/${$route.params.group}/users`)"
            ><h1>Group Users</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="$router.push(`/group/${$route.params.group}/dairy`)"
            ><h1>Group Dairy</h1></v-card
          ></v-col
        >
      </v-row>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import UpdateGroupForm from '~/components/UpdateGroupForm.vue'
import FetchService from '~/services/FetchService'
export default {
  name: 'GroupPage',
  components: { UpdateGroupForm },
  middleware: authRouter,
  data() {
    return {
      group: null,
      editEmployeeDetails: false,
      showDetails: false,
      loading: false,
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
        this.group = group.data.group
        this.loading = false
        this.editEmployeeDetails = false
      }
    },
  },
}
</script>

<style></style>
