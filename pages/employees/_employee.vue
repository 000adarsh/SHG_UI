<template>
  <div>
    <h3 class="text-center">Employee Details</h3>
    <v-divider></v-divider>

    <v-simple-table v-if="employee" class="py-2">
      <tbody>
        <tr>
          <td>Employee Name</td>
          <td>{{ employee.name }}</td>
        </tr>
        <tr>
          <td>Father Name</td>
          <td>{{ employee.fatherName }}</td>
        </tr>
        <tr>
          <td>Designation</td>
          <td>{{ employee.role }}</td>
        </tr>
        <template v-if="show">
          <tr>
            <td>Email</td>
            <td>{{ employee.email }}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{{ employee.phone }}</td>
          </tr>
          <tr>
            <td>Alternative Phone</td>
            <td>{{ employee.alternativePhone }}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>{{ employee.address }}</td>
          </tr>
          <tr>
            <td>Active Status</td>
            <td>{{ employee.isActive }}</td>
          </tr>
          <tr>
            <td>Account Verification</td>
            <td>{{ employee.isAccountVerified ? '✔' : '❌' }}</td>
          </tr>
          <tr>
            <td>Creator</td>
            <td>{{ employee.createdBy.name }}</td>
          </tr>
          <tr>
            <td>Join Date</td>
            <td>
              {{ employee.createdAt }}
            </td>
          </tr>
          <tr>
            <td>Updator</td>
            <td>{{ employee.updatedBy.name }}</td>
          </tr>
          <tr>
            <td>Update Date</td>
            <td>{{ employee.updatedAt }}</td>
          </tr>
        </template>
      </tbody>
    </v-simple-table>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn icon color="primary" outlined @click="show = !show">
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <h3 class="text-center">Employee Group Permissions</h3>
    <v-divider></v-divider>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'EmployeePage',
  middleware: authRouter,
  data() {
    return {
      show: false,
      employee: null,
    }
  },

  async created() {
    await this.getEmployee(this.$route.params.employee)
  },
  methods: {
    async getEmployee(id) {
      const employee = await FetchService.getEmployee({ employeeId: id })
      if (employee) {
        this.$root.$emit('showNotification', employee)
      }
      if (employee.data.status === 'success') {
        this.employee = employee.data.employee
      }
    },
  },
}
</script>

<style></style>
