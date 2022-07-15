<template>
  <div>
    <div>
      <v-overlay :value="pageLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </div>
    <v-card-actions>
      <v-btn color="primary" text outlined @click="editEmployeeDetails = true">
        edit details
      </v-btn>
    </v-card-actions>
    <div class="pt-1">
      <h3 class="text-center">Employee Details</h3>
      <v-divider></v-divider>
    </div>
    <v-dialog :value="editEmployeeDetails" persistent max-width="900px">
      <EmployeeForm
        :employee="employee"
        :loading="loading"
        @closeDialog="
          () => {
            editEmployeeDetails = false
          }
        "
        @submit="updateEmployee"
      />
    </v-dialog>
    <v-simple-table v-if="employee" dense>
      <tbody>
        <tr>
          <td>Employee Name</td>
          <td class="text-capitalize">{{ employee.name }}</td>
        </tr>
        <tr>
          <td>Father Name</td>
          <td class="text-capitalize">{{ employee.fatherName }}</td>
        </tr>
        <tr>
          <td>Designation</td>
          <td class="text-capitalize">{{ employee.role }}</td>
        </tr>
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
          <td class="text-capitalize">{{ employee.address }}</td>
        </tr>
        <tr>
          <td>Active Status</td>
          <td class="text-capitalize">{{ employee.isActive }}</td>
        </tr>
        <tr>
          <td>Account Verification</td>
          <td>{{ employee.isAccountVerified ? '✔' : '❌' }}</td>
        </tr>
        <tr>
          <td>Creator</td>
          <td class="text-capitalize">{{ employee.createdBy.name }}</td>
        </tr>
        <tr>
          <td>Join Date</td>
          <td>
            {{ $moment(employee.createdAt).format('DD MMM YYYY') }}
          </td>
        </tr>
        <tr>
          <td>Updator</td>
          <td class="text-capitalize">{{ employee.updatedBy.name }}</td>
        </tr>
        <tr>
          <td>Update Date</td>
          <td>
            {{ $moment(employee.updatedAt).format('DD MMM YYYY') }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-divider></v-divider>
  </div>
</template>

<script>
import FetchService from '~/services/FetchService'

export default {
  name: 'EmployeeDetailsPage',
  data() {
    return {
      pageLoading: false,
      loading: false,
      employee: null,
      editEmployeeDetails: false,
    }
  },

  async created() {
    await this.getEmployee(this.$route.params.employee)
  },
  methods: {
    async getEmployee(id) {
      this.pageLoading = true
      const employee = await FetchService.getEmployee({ employeeId: id })
      if (employee) {
        this.pageLoading = false
        this.$root.$emit('showNotification', employee)
      }
      if (employee.data.status === 'success') {
        this.employee = employee.data.employee
      }
    },
    async updateEmployee(e) {
      this.loading = true
      const updateEmployee = await FetchService.updateEmployee(e)
      if (updateEmployee) {
        this.$root.$emit('showNotification', updateEmployee)
      }
      if (updateEmployee.data.status === 'success') {
        await this.getEmployee(this.$route.params.employee)
        this.loading = false
        this.editEmployeeDetails = false
      }
      this.loading = false
    },
  },
}
</script>

<style></style>
