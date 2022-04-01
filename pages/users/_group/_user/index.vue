<template>
  <div>
    <v-card-actions>
      <v-btn color="primary" outlined @click="updateUserForm = true">
        edit details
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" outlined @click="deleteUserForm = true">
        delete user
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-if="updateUserForm"
      :value="updateUserForm"
      persistent
      max-width="900px"
      ><UpdateUserForm
        :loading="updateLoading"
        :user="user"
        @closeDialog="
          () => {
            updateUserForm = false
          }
        "
        @submit="updateUser"
    /></v-dialog>
    <v-dialog
      v-if="deleteUser"
      :value="deleteUserForm"
      persistent
      max-width="900px"
      ><v-card>
        <div>
          <v-card-title class="text-center"
            >Are you sure want to delete this user</v-card-title
          >
        </div>
        <v-card-actions
          ><v-spacer></v-spacer
          ><v-btn color="success" outlined @click="deleteUserForm = false"
            >no</v-btn
          ><v-btn
            color="error"
            outlined
            :loading="deleteLoading"
            @click="deleteUser"
            >yes</v-btn
          ></v-card-actions
        ></v-card
      ></v-dialog
    >
    <div class="py-3">
      <h3 class="text-center">Group Details</h3>
      <v-divider></v-divider>
      <v-simple-table v-if="user">
        <tbody>
          <tr>
            <td>User Name</td>
            <td>{{ user.name }}</td>
          </tr>
          <tr>
            <td>Father Name</td>
            <td>{{ user.fatherName }}</td>
          </tr>
          <tr>
            <td>Husband Name</td>
            <td>{{ user.husbandName }}</td>
          </tr>
          <template v-if="showDetails">
            <tr>
              <td>Address</td>
              <td>{{ user.address }}</td>
            </tr>
            <tr>
              <td>Mobile No</td>
              <td>{{ user.phone }}</td>
            </tr>
            <tr>
              <td>Alternative Mobile No</td>
              <td>{{ user.alternativePhone }}</td>
            </tr>
            <tr>
              <td>Join Group</td>
              <td>{{ user.groupId.name }}</td>
            </tr>
            <tr>
              <td>Creater</td>
              <td>{{ user.createdBy.name }}</td>
            </tr>
            <tr>
              <td>Create Date</td>
              <td>{{ user.createdAt }}</td>
            </tr>
            <tr>
              <td>Updater</td>
              <td>{{ user.updatedBy.name }}</td>
            </tr>
            <tr>
              <td>Update Date</td>
              <td>{{ user.updatedAt }}</td>
            </tr>
            <tr>
              <td>Active Status</td>
              <td>{{ user.isActive }}</td>
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
      <h3 class="text-center">User Other Details</h3>
      <v-divider></v-divider>
      <v-row class="pt-2">
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/users/${$route.params.group}/${$route.params.user}/loan`
              )
            "
            ><h1>User Loans</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/users/${$route.params.group}/${$route.params.user}/saving`
              )
            "
            ><h1>User Savings</h1></v-card
          ></v-col
        >
        <v-col cols="12" sm="6" lg="4">
          <v-card
            outlined
            :hover="true"
            class="text-center"
            @click="
              $router.push(
                `/users/${$route.params.group}/${$route.params.user}/loaninstallment`
              )
            "
            ><h1>User Loan Installments</h1></v-card
          ></v-col
        >
      </v-row>
    </div>
  </div>
</template>

<script>
import UpdateUserForm from '~/components/UpdateUserForm.vue'
import FetchService from '~/services/FetchService'
export default {
  name: 'UserPage',
  components: { UpdateUserForm },
  data() {
    return {
      user: null,
      deleteUserForm: false,
      updateUserForm: false,
      updateLoading: false,
      deleteLoading: false,
      showDetails: false,
    }
  },
  async created() {
    await this.getUserDetails({
      userId: this.$route.params.user,
      groupId: this.$route.params.group,
    })
  },
  methods: {
    async getUserDetails(payload) {
      const user = await FetchService.getUser(payload)
      if (user) {
        this.$root.$emit('showNotification', user)
      }
      if (user.data.status === 'success') {
        this.user = user.data.user
      }
    },
    async updateUser(payload) {
      const user = await FetchService.updateUser({
        ...payload,
        userId: this.$route.params.user,
        groupId: this.$route.params.group,
      })
      if (user) {
        this.$root.$emit('showNotification', user)
      }
      if (user.data.status === 'success') {
        this.updateLoading = false
        this.updateUserForm = false
        this.user = user.data.user
      }
      this.updateLoading = false
    },
    async deleteUser() {
      this.deleteLoading = true
      const user = await FetchService.deleteUser({
        userId: this.$route.params.user,
        groupId: this.$route.params.group,
      })
      if (user) {
        this.$root.$emit('showNotification', user)
      }
      if (user.data.status === 'success') {
        this.deleteLoading = false
        this.deleteUserForm = false
        this.user = user.data.user
      }
      this.deleteLoading = false
    },
  },
}
</script>

<style></style>
