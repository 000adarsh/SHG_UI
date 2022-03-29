<template>
  <div>
    <v-card-actions>
      <v-btn color="primary" outlined @click="editEmployeeDetails = true">
        edit details
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" outlined> edit permissions </v-btn>
    </v-card-actions>
    <div class="py-3">
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
    <v-simple-table v-if="employee">
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
        <template v-if="showDetails">
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
      <v-btn icon color="primary" outlined @click="showDetails = !showDetails">
        <v-icon>{{
          showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'
        }}</v-icon>
      </v-btn>
    </v-card-actions>

    <div class="py-3">
      <h3 class="text-center">Employee Permissions</h3>
      <v-divider></v-divider>
    </div>
    <div v-if="employee && employee.permissions">
      <v-simple-table>
        <tbody>
          <tr v-for="(key, i) in Object.keys(employee.permissions)" :key="i">
            <td>
              {{ employee.permissions[key] }}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
import EmployeeForm from '~/components/EmployeeForm.vue'
export default {
  name: 'EmployeePage',
  components: {
    EmployeeForm,
  },
  middleware: authRouter,
  data() {
    return {
      loading: false,
      showDetails: false,
      employee: null,
      editEmployeeDetails: false,
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
    async updateEmployee(e) {
      const updateEmployee = await FetchService.updateEmployee(e)
      if (updateEmployee) {
        this.$root.$emit('showNotification', updateEmployee)
      }
      if (updateEmployee.data.status === 'success') {
        this.loading = false
        this.editEmployeeDetails = false
        this.getEmployee(this.$route.params.employee)
      }
    },
  },
}
</script>

<style></style>
