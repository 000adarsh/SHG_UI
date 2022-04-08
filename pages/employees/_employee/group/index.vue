<template>
  <div>
    <v-card-actions
      ><v-spacer></v-spacer
      ><v-btn text outlined color="primary"
        >Add employee to group</v-btn
      ></v-card-actions
    >
    <div class="py-2 text-center">
      <h3>Employee Groups</h3>
      <v-divider></v-divider>
    </div>
    <v-row>
      <v-col v-for="(group, i) in groups" :key="i" cols="12" sm="6" lg="4">
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
      groups: [],
    }
  },
  created() {
    this.getAllEmployeesGroups()
  },
  methods: {
    showGroupInfo(payload) {
      this.$router.push(
        `/employees/${this.$route.params.employee}/group/${payload.groupId.id}?name=${payload.groupId.name}`
      )
    },
    async getAllEmployeesGroups() {
      const group = await FetchService.getAllEmployeeGroups()
      if (group) {
        this.$root.$emit('showNotification', group)
      }
      if (group.data.status === 'success') {
        this.groups = group.data.groups
      }
    },
  },
}
</script>

<style></style>
