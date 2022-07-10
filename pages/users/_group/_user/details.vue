<template>
  <div>
    <v-card-actions>
      <v-btn
        v-if="user"
        color="primary"
        text
        outlined
        @click="updateUserForm = true"
      >
        edit details
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="error" text outlined @click="deleteUserForm = true">
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
          ><v-btn color="success" text outlined @click="deleteUserForm = false"
            >no</v-btn
          ><v-btn
            color="error"
            text
            outlined
            :loading="deleteLoading"
            @click="deleteUser"
            >yes</v-btn
          ></v-card-actions
        ></v-card
      ></v-dialog
    >
    <div class="pt-3">
      <h3 class="text-center">User Details</h3>
      <v-divider></v-divider>
      <v-simple-table v-if="user" dense>
        <tbody class="text-capitalize">
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
            <td>
              {{ $moment(user.createDate).format('DD MMM YYYY ') }}
            </td>
          </tr>
          <tr>
            <td>Updater</td>
            <td>{{ user.updatedBy.name }}</td>
          </tr>
          <tr>
            <td>Update Date</td>
            <td>
              {{ $moment(user.updatedAt).format('DD MMM YYYY ') }}
            </td>
          </tr>
          <tr>
            <td>Note</td>
            <td>{{ user.note }}</td>
          </tr>
          <tr>
            <td>Active Status</td>
            <td>{{ user.isActive }}</td>
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
  name: 'UserDetailsPage',
  middleware: authRouter,
  data() {
    return {
      user: null,
      deleteUserForm: false,
      updateUserForm: false,
      updateLoading: false,
      deleteLoading: false,
    }
  },
  async created() {
    await this.getUserDetails()
  },
  methods: {
    async getUserDetails() {
      const user = await FetchService.getUser({
        userId: this.$route.params.user,
        groupId: this.$route.params.group,
      })
      if (user) {
        this.$root.$emit('showNotification', user)
      }
      if (user.data.status === 'success') {
        this.user = user.data.user
      }
    },
    async updateUser(payload) {
      this.updateLoading = true
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
        await this.getUserDetails()
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
        this.$router.replace(
          `/users/${this.$route.params.group}?name=${this.$route.query.groupName}`
        )
      }
      this.deleteLoading = false
    },
  },
}
</script>

<style></style>
