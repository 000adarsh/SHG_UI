<template>
  <div>
    <div>
      <h1 class="text-center">
        {{ $route.query.name.toUpperCase() }}
      </h1>
    </div>
    <v-card-actions
      ><v-spacer></v-spacer
      ><v-btn text outlined color="primary"
        >edit group permission</v-btn
      ></v-card-actions
    >
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
    }
  },
  created() {
    this.getEmployeeGroupPermissions()
  },
  methods: {
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
