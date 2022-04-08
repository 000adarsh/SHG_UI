<template>
  <div>
    <v-card-actions
      ><v-spacer></v-spacer
      ><v-btn text outlined color="primary"
        >edit permission</v-btn
      ></v-card-actions
    >
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
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'EmployeePermissionPage',
  middleware: authRouter,
  data() {
    return {
      permissions: null,
    }
  },
  created() {
    this.getEmployeePermission()
  },
  methods: {
    async getEmployeePermission() {
      const permission = await FetchService.getEmployee({
        employeeId: this.$route.params.employee,
      })
      if (permission) {
        this.$root.$emit('showNotification', permission)
      }
      console.log(permission)
      if (permission.data.status === 'success') {
        this.permissions = permission.data.employee.permissions
      }
    },
  },
}
</script>

<style></style>
