<template>
  <div>
    <div v-if="activeEmployees.length" class="py-3">
      <h2 class="text-center">Active Employees</h2>
      <v-divider></v-divider>
    </div>
    <v-row>
      <v-col
        v-for="(employee, i) in activeEmployees"
        :key="i"
        cols="12"
        sm="6"
        lg="4"
      >
        <EmployeeInfoCard :data="employee" />
      </v-col>
    </v-row>
    <div v-if="inactiveEmployees.length" class="py-3">
      <h2 class="text-center">Inactive Employees</h2>
      <v-divider></v-divider>
    </div>
    <v-row>
      <v-col
        v-for="(employee, i) in inactiveEmployees"
        :key="i"
        cols="12"
        sm="6"
        lg="4"
      >
        <EmployeeInfoCard :data="employee" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EmployeeInfoCard from '~/components/EmployeeInfoCard.vue'
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'EmployeesPage',
  components: {
    EmployeeInfoCard,
  },
  middleware: authRouter,
  data() {
    return {
      employees: [],
    }
  },
  computed: {
    activeEmployees() {
      return this.employees.filter((u) => {
        return u.isActive
      })
    },
    inactiveEmployees() {
      return this.employees.filter((u) => {
        return !u.isActive
      })
    },
  },
  async created() {
    // check employee permission
    // when permission then find employees
    const employees = await FetchService.getAllEmployees()
    if (employees) {
      this.$root.$emit('showNotification', employees)
    }
    if (employees.data.status === 'success') {
      this.employees = employees.data.employees
    }
  },
  methods: {
    // checkEmployeePermission() {},
  },
}
</script>

<style></style>
