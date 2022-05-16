<template>
  <div v-if="group">
    <div>
      <h1 class="text-center text-uppercase">
        {{ group.name }}
      </h1>
    </div>
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
          <template v-if="showDetails">
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
                {{
                  $moment(group ? group.startDate : '').format('DD MMM YYYY')
                }}
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
    <div class="pb-3">
      <h3 class="text-center">Group Other Details</h3>
      <v-divider></v-divider>
    </div>
    <div class="py-2">
      <v-row>
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click.prevent="
              $router.push(
                `/group/${$route.params.group}/fundings?name=${group.name}`
              )
            "
            ><h1>Fundings</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/loans?name=${group.name}`
              )
            "
            ><h1>Loans</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/savings?name=${group.name}`
              )
            "
            ><h1>Savings</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/users?name=${group.name}`
              )
            "
            ><h1>Users</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/dairy?name=${group.name}`
              )
            "
            ><h1>Dairy</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/loanInstallments?name=${group.name}`
              )
            "
            ><h1>Loans Installments</h1></v-card
          ></v-col
        >
        <v-col class="py-1" cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/group/${$route.params.group}/bankTransactions?name=${group.name}`
              )
            "
            ><h1>Bank Transactions</h1></v-card
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
      editGroupDetails: false,
      showDetails: false,
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
