<template>
  <div>
    <v-card-actions>
      <v-btn color="primary" text outlined @click="editEmployeeDetails = true">
        edit details
      </v-btn>
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
              {{ $moment(employee.createdAt).format('DD MMM YYYY hh:mm:ss a') }}
            </td>
          </tr>
          <tr>
            <td>Updator</td>
            <td>{{ employee.updatedBy.name }}</td>
          </tr>
          <tr>
            <td>Update Date</td>
            <td>
              {{ $moment(employee.updatedAt).format('DD MMM YYYY hh:mm:ss a') }}
            </td>
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
    <v-row
      ><v-col cols="12" sm="6" lg="4"
        ><v-card
          outlined
          :hover="true"
          @click="
            $router.push(
              `/employees/${$route.params.employee}/employeePermission`
            )
          "
          ><h1 class="text-center">Permission</h1></v-card
        ></v-col
      ><v-col cols="12" sm="6" lg="4"
        ><v-card
          outlined
          :hover="true"
          @click="$router.push(`/employees/${$route.params.employee}/group`)"
          ><h1 class="text-center">Group Permission</h1></v-card
        ></v-col
      ></v-row
    >
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import EmployeeForm from '~/components/EmployeeForm.vue'
import FetchService from '~/services/FetchService'
export default {
  name: 'EmployeeDetailsPage',
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
