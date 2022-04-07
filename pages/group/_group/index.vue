<template>
  <div>
    <div>
      <h1 class="text-center">
        {{ $route.query.name.toUpperCase() }}
      </h1>
    </div>
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
              <td>Group Loan Interest</td>
              <td>{{ group.loanInterestPercentage }}</td>
            </tr>
            <tr>
              <td>Group Work StartDate</td>
              <td>
                {{
                  $moment(group ? group.startDate : '').format(
                    'DD MMM YYYY hh:mm:ss a'
                  )
                }}
              </td>
            </tr>
            <tr>
              <td>Creater</td>
              <td>{{ group.createdBy.name }}</td>
            </tr>
            <tr>
              <td>Create Date</td>
              <td>
                {{ $moment(group.createdAt).format('DD MMM YYYY hh:mm:ss a') }}
              </td>
            </tr>
            <tr>
              <td>Updater</td>
              <td>{{ group.updatedBy.name }}</td>
            </tr>
            <tr>
              <td>Update Date</td>
              <td>
                {{ $moment(group.updatedAt).format('DD MMM YYYY hh:mm:ss a') }}
              </td>
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
      <h3 class="pa-2 text-center">Group Details</h3>
      <v-divider></v-divider>
      <v-row class="pt-2">
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="pa-2 text-center"
            @click.prevent="
              $router.push(
                `/group/${$route.params.group}/fundings?name=${$route.query.name}`
              )
            "
            ><h1>Fundings</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="pa-2 text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/loans?name=${$route.query.name}`
              )
            "
            ><h1>Loans</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="pa-2 text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/savings?name=${$route.query.name}`
              )
            "
            ><h1>Savings</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="pa-2 text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/users?name=${$route.query.name}`
              )
            "
            ><h1>Users</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="pa-2 text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/dairy?name=${$route.query.name}`
              )
            "
            ><h1>Dairy</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="pa-2 text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/loanInstallments?name=${$route.query.name}`
              )
            "
            ><h1>Loans Installments</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="pa-2 text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/bankTransections?name=${$route.query.name}`
              )
            "
            ><h1>Bank Transections</h1></v-card
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
      this.loading = false
    },
  },
}
</script>

<style></style>
