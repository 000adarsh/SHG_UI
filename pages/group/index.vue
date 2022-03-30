<template>
  <div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" outlined @click="createGroup = true">
        create new group
      </v-btn>
    </v-card-actions>
    <v-dialog :value="createGroup" persistent max-width="900px">
      <CreateGroupForm
        :loading="loading"
        @closeDialog="
          () => {
            createGroup = false
          }
        "
        @submit="createNewGroup"
      />
    </v-dialog>
    <div class="py-3">
      <h2 class="text-center">Groups</h2>
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
import GroupInfoCard from '~/components/gorupInfoCard.vue'
import CreateGroupForm from '~/components/CreateGroupForm.vue'
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'GroupPage',
  components: { GroupInfoCard, CreateGroupForm },
  middleware: authRouter,
  data() {
    return {
      groups: [],
      loading: false,
      createGroup: false,
    }
  },
  async created() {
    await this.getEmployeeGroups()
  },
  methods: {
    showGroupInfo(payload) {
      this.$router.push(`/group/${payload.groupId.id}`)
    },
    async getEmployeeGroups() {
      const groups = await FetchService.getAllEmployeeGroups()
      if (groups) {
        this.$root.$emit('showNotification', groups)
      }
      if (groups.data.status === 'success') {
        this.groups = groups.data.groups
      }
    },
    async createNewGroup(payload) {
      this.loading = true
      const group = await FetchService.createGroup(payload)
      if (group) {
        this.$root.$emit('showNotification', group)
      }
      if (group.data.status === 'success') {
        this.loading = false
        this.createGroup = false
        await this.getEmployeeGroups()
      }
      this.loading = false
    },
  },
}
</script>

<style></style>
