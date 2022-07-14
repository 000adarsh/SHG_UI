<template>
  <div>
    <div>
      <v-overlay :value="pageLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <v-card-actions
      ><v-btn
        v-if="allGroupfind && myGroupfind"
        text
        outlined
        color="error"
        @click="removeEmployeeFromGroupForm = true"
        >Remove employee</v-btn
      ><v-spacer></v-spacer
      ><v-btn
        v-if="allGroupfind && myGroupfind"
        text
        outlined
        color="primary"
        @click="addEmployeeToGroupForm = true"
        >Add employee</v-btn
      ></v-card-actions
    >
    <v-dialog
      v-if="removeEmployeeFromGroupForm"
      :value="removeEmployeeFromGroupForm"
      persistent
      max-width="900px"
      ><RemoveEmployeeFromGroup
        :employee-group="employeeGroups"
        :all-group="allGroups"
        :loading="removeLoading"
        @closeDialog="
          () => {
            removeEmployeeFromGroupForm = false
          }
        "
        @submit="removeEmployeeFromGroup"
    /></v-dialog>
    <v-dialog
      v-if="addEmployeeToGroupForm"
      :value="addEmployeeToGroupForm"
      persistent
      max-width="900px"
      ><AddEmployeeToGroupForm
        :employee-group="employeeGroups"
        :all-group="allGroups"
        :loading="addLoading"
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
      pageLoading: false,
      addLoading: false,
      employeeGroups: [],
      allGroups: [],
      addEmployeeToGroupForm: false,
      removeEmployeeFromGroupForm: false,
      removeLoading: false,
      allGroupfind: false,
      myGroupfind: false,
    }
  },
  created() {
    this.getEmployeeGroups()
  },
  methods: {
    async removeEmployeeFromGroup(payload) {
      this.removeLoading = true
      const removeFromGroup = await FetchService.removeEmployeeFromGroup({
        employeeId: this.$route.params.employee,
        groupId: payload.groupId,
      })
      if (removeFromGroup) {
        this.$root.$emit('showNotification', removeFromGroup)
      }
      if (removeFromGroup.data.status === 'success') {
        this.removeLoading = false
        this.removeEmployeeFromGroupForm = false
        await this.getEmployeeGroups()
      }
      this.removeLoading = false
    },
    async addEmployeeToGroup(payload) {
      this.addLoading = true
      const addToGroup = await FetchService.addEmployeeToGroup({
        employeeId: this.$route.params.employee,
        groupId: payload.groupId,
      })
      if (addToGroup) {
        this.$root.$emit('showNotification', addToGroup)
      }
      if (addToGroup.data.status === 'success') {
        this.addLoading = false
        this.addEmployeeToGroupForm = false
        await this.getEmployeeGroups()
      }
      this.addLoading = false
    },
    showGroupInfo(payload) {
      this.$router.push(
        `/employees/${this.$route.params.employee}/group/${payload.groupId.id}?name=${payload.groupId.name}`
      )
    },
    async getAllGroups() {
      const groups = await FetchService.getAllGroups()
      if (groups) {
        this.pageLoading = false
      }
      if (groups.data.status === 'success') {
        this.allGroups = groups.data.groups
        this.allGroupfind = true
      }
    },
    async getEmployeeGroups() {
      this.pageLoading = true
      const group = await FetchService.getEmployeeGroups({
        employeeId: this.$route.params.employee,
      })
      if (group) {
        this.$root.$emit('showNotification', group)
      }
      if (group.data.status === 'success') {
        this.employeeGroups = group.data.groups
        this.myGroupfind = true
      }
      this.getAllGroups()
    },
  },
}
</script>

<style></style>
