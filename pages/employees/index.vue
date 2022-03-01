<template>
  <div>
    <div v-if="activeEmployees.length">
      <h2 class="text-center">Active Employees</h2>
      <v-divider></v-divider>
    </div>
    <v-row class="pt-3">
      <v-col
        v-for="(employee, i) in activeEmployees"
        :key="i"
        cols="12"
        sm="6"
        lg="4"
      >
        <InfoCard :data="employee" />
      </v-col>
    </v-row>
    <div v-if="inactiveEmployees.length">
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
        <InfoCard :data="employee" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import InfoCard from '~/components/InfoCard.vue'
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'EmployeesPage',
  components: {
    InfoCard,
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
