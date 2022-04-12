<template>
  <div>
    <div>
      <h1 class="text-center">
        {{ $route.query.name.toUpperCase() }}
      </h1>
    </div>
    <v-card-actions class="px-0"
      ><v-btn
        v-if="myPermissions && groupPermissions"
        text
        outlined
        color="error"
        @click="removeEmployeeGroupPermissionForm = true"
        >remove permission</v-btn
      ><v-spacer></v-spacer
      ><v-btn
        v-if="myPermissions && groupPermissions"
        text
        outlined
        color="error"
        @click="addEmployeeGroupPermissionForm = true"
        >add permission</v-btn
      ></v-card-actions
    >
    <v-dialog
      v-if="removeEmployeeGroupPermissionForm"
      :value="removeEmployeeGroupPermissionForm"
      persistent
      max-width="900px"
      ><RemoveEmployeePermissionForm
        :my-permissions="myPermissions"
        :permissions="groupPermissions"
        :loading="removeGroupPermissionLoading"
        @closeDialog="
          () => {
            removeEmployeeGroupPermissionForm = false
          }
        "
        @submit="removeEmployeeGroupPermissions"
    /></v-dialog>
    <v-dialog
      v-if="addEmployeeGroupPermissionForm"
      :value="addEmployeeGroupPermissionForm"
      persistent
      max-width="1000px"
      ><AddEmployeePermissionForm
        :my-permissions="myPermissions"
        :permissions="groupPermissions"
        :loading="removeGroupPermissionLoading"
        @closeDialog="
          () => {
            addEmployeeGroupPermissionForm = false
          }
        "
        @submit="addEmployeeGroupPermissions"
    /></v-dialog>
    <div class="py-2 text-center">
      <h3>Employee Group Permissions</h3>
      <v-divider></v-divider>
    </div>
    <v-simple-table
      ><tbody v-if="groupPermissions">
        <tr v-for="(permission, i) in Object.keys(groupPermissions)" :key="i">
          <td>{{ groupPermissions[permission] }}</td>
        </tr>
      </tbody></v-simple-table
    >
  </div>
</template>
<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'EmployeeGroupPermissionPage',
  middleware: authRouter,
  data() {
    return {
      groupPermissions: null,
      myPermissions: null,
      removeEmployeeGroupPermissionForm: false,
      removeGroupPermissionLoading: false,
      addEmployeeGroupPermissionForm: false,
      addGroupPermissionLoading: false,
    }
  },
  async created() {
    await this.getEmployeeGroupPermissions()
    await this.getMyGroupPermissions()
  },
  methods: {
    async removeEmployeeGroupPermissions(payload) {
      this.removeGroupPermissionLoading = true
      const permission = await FetchService.removeEmployeeGroupPermissions({
        employeeId: this.$route.params.employee,
        groupId: this.$route.params.employeeGroupPermission,
        permissions: payload.permissions,
      })
      if (permission) {
        this.$root.$emit('showNotification', permission)
      }
      if (permission.data.status === 'success') {
        this.removeGroupPermissionLoading = false
        this.removeEmployeeGroupPermissionForm = false
        await this.getEmployeeGroupPermissions()
      }
      this.removeGroupPermissionLoading = false
    },
    async addEmployeeGroupPermissions(payload) {
      this.addGroupPermissionLoading = true
      const permission = await FetchService.addEmployeeGroupPermissions({
        employeeId: this.$route.params.employee,
        groupId: this.$route.params.employeeGroupPermission,
        permissions: payload.permissions,
      })
      if (permission) {
        this.$root.$emit('showNotification', permission)
      }
      if (permission.data.status === 'success') {
        this.addGroupPermissionLoading = false
        this.addEmployeeGroupPermissionForm = false
        await this.getEmployeeGroupPermissions()
      }
      this.addGroupPermissionLoading = false
    },
    async getMyGroupPermissions() {
      const myPermission = await FetchService.getMyGroupPermissions({
        groupId: this.$route.params.employeeGroupPermission,
      })
      if (myPermission) {
        this.$root.$emit('showNotification', myPermission)
      }
      if (myPermission.data.status === 'success') {
        this.myPermissions = myPermission.data.permissions.permissions
      }
    },
    async getEmployeeGroupPermissions() {
      const groupPermission = await FetchService.getEmployeeGroupPermissions({
        groupId: this.$route.params.employeeGroupPermission,
        employeeId: this.$route.params.employee,
      })
      if (groupPermission) {
        this.$root.$emit('showNotification', groupPermission)
      }
      if (groupPermission.data.status === 'success') {
        this.groupPermissions =
          groupPermission.data.groupPermissions.permissions
      }
    },
  },
}
</script>

<style></style>
