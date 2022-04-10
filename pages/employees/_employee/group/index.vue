<template>
  <div>
    <v-card-actions
      ><v-spacer></v-spacer
      ><v-btn
        text
        outlined
        color="primary"
        @click="addEmployeeToGroupForm = true"
        >Add employee to group</v-btn
      ></v-card-actions
    >
    <v-dialog
      v-if="addEmployeeToGroupForm"
      :value="addEmployeeToGroupForm"
      persistent
      max-width="900px"
      ><AddEmployeeToGroupForm
        :data="allGroups"
        :loading="loading"
        @closeDialog="
          () => {
            addEmployeeToGroupForm = false
          }
        "
        @submit="addEmployeeToGroup"
      />
    </v-dialog>
    <div class="py-2 text-center">
      <h3>Employee Groups</h3>
      <v-divider></v-divider>
    </div>
    <v-row>
      <v-col
        v-for="(group, i) in employeeGroups"
        :key="i"
        cols="12"
        sm="6"
        lg="4"
      >
        <GroupInfoCard :data="group" @ok="showGroupInfo" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'EmployeeGroupPage',
  middleware: authRouter,
  data() {
    return {
      loading: false,
      employeeGroups: [],
      allGroups: [],
      addEmployeeToGroupForm: false,
    }
  },
  created() {
    this.getAllEmployeesGroups()
    this.getAllGroups()
  },
  methods: {
    async addEmployeeToGroup(payload) {
      this.loading = true
      const addToGroup = await FetchService.addEmployeeToGroup({
        employeeId: this.$route.params.employee,
        groupId: payload.groupId,
      })
      if (addToGroup) {
        this.$root.$emit('showNotification', addToGroup)
      }
      if (addToGroup.data.status === 'success') {
        this.loading = false
        this.addEmployeeToGroupForm = false
        await this.getAllEmployeesGroups()
      }
      this.loading = false
    },
    showGroupInfo(payload) {
      this.$router.push(
        `/employees/${this.$route.params.employee}/group/${payload.groupId.id}?name=${payload.groupId.name}`
      )
    },
    async getAllGroups() {
      const groups = await FetchService.getAllGroups()
      if (groups.data.status === 'success') {
        this.allGroups = groups.data.groups
      }
    },
    async getAllEmployeesGroups() {
      const group = await FetchService.employeeGroups({
        employeeId: this.$route.params.employee,
      })
      if (group) {
        this.$root.$emit('showNotification', group)
      }
      if (group.data.status === 'success') {
        this.employeeGroups = group.data.groups
      }
    },
  },
}
</script>

<style></style>
