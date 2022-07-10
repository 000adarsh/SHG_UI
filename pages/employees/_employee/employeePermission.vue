<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <v-card-actions class="px-0"
      ><v-btn
        v-if="permissions && myPermissions"
        text
        outlined
        color="error"
        @click="removeEmployeePermissionForm = true"
        >remove permission</v-btn
      ><v-spacer></v-spacer
      ><v-btn
        v-if="permissions && myPermissions"
        text
        outlined
        color="error"
        :disabled="!employee.isActive"
        @click="addEmployeePermissionForm = true"
        >add permission</v-btn
      ></v-card-actions
    >
    <v-dialog
      v-if="removeEmployeePermissionForm"
      :value="removeEmployeePermissionForm"
      persistent
      max-width="900px"
      ><remove-employee-permission-form
        :my-permissions="myPermissions"
        :permissions="permissions"
        :loading="removePermissionLoading"
        @closeDialog="
          () => {
            removeEmployeePermissionForm = false
          }
        "
        @submit="removeEmployeePermissions"
    /></v-dialog>
    <v-dialog
      v-if="addEmployeePermissionForm"
      :value="addEmployeePermissionForm"
      persistent
      max-width="900px"
      ><AddEmployeePermissionForm
        :my-permissions="myPermissions"
        :permissions="permissions"
        :loading="addPermissionLoading"
        @closeDialog="
          () => {
            addEmployeePermissionForm = false
          }
        "
        @submit="addEmployeePermissions"
    /></v-dialog>
    <div class="py-2 text-center">
      <h3>Employee Permissions</h3>
      <v-divider></v-divider>
    </div>
    <v-simple-table
      ><tbody v-if="permissions">
        <tr v-for="(permission, i) in Object.keys(permissions)" :key="i">
          <td>{{ permissions[permission] }}</td>
        </tr>
      </tbody></v-simple-table
    >
  </div>
</template>

<script>
import RemoveEmployeePermissionForm from '~/components/RemoveEmployeePermissionForm.vue'
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'EmployeePermissionPage',
  components: { RemoveEmployeePermissionForm },
  middleware: authRouter,
  data() {
    return {
      permissions: null,
      myPermissions: null,
      addEmployeePermissionForm: false,
      addPermissionLoading: false,
      removeEmployeePermissionForm: false,
      removePermissionLoading: false,
      employee: null,
    }
  },
  async created() {
    await this.getEmployeePermissions()
    await this.getMyPermissions()
  },
  methods: {
    async removeEmployeePermissions(payload) {
      this.removePermissionLoading = true
      const permission = await FetchService.removeEmployeePermissions({
        employeeId: this.$route.params.employee,
        permissions: payload.permissions,
      })
      if (permission) {
        this.$root.$emit('showNotification', permission)
      }
      if (permission.data.status === 'success') {
        this.removePermissionLoading = false
        this.removeEmployeePermissionForm = false
        await this.getEmployeePermissions()
      }
      this.removePermissionLoading = false
    },
    async addEmployeePermissions(payload) {
      this.addPermissionLoading = true
      const permission = await FetchService.addEmployeePermissions({
        employeeId: this.$route.params.employee,
        permissions: payload.permissions,
      })
      if (permission) {
        this.$root.$emit('showNotification', permission)
      }
      if (permission.data.status === 'success') {
        this.addPermissionLoading = false
        this.addEmployeePermissionForm = false
        await this.getEmployeePermissions()
      }
      this.addPermissionLoading = false
    },
    async getMyPermissions() {
      const permission = await FetchService.getMyPermissions()
      if (permission.data.status === 'success') {
        this.myPermissions = permission.data.permissions.permissions
      }
    },
    async getEmployeePermissions() {
      const permission = await FetchService.getEmployee({
        employeeId: this.$route.params.employee,
      })
      if (permission) {
        permission.data.message = 'Permission sucessfull find'
        this.$root.$emit('showNotification', permission)
      }
      if (permission.data.status === 'success') {
        this.permissions = permission.data.employee.permissions
        this.employee = permission.data.employee
      }
    },
  },
}
</script>

<style></style>
