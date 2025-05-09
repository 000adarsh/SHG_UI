<template>
  <div>
    <div>
      <v-overlay :value="pageLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text outlined @click="createGroup = true">
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
    <v-row class="py-2">
      <v-col
        v-for="(group, i) in groups"
        :key="i"
        cols="12"
        sm="6"
        lg="4"
        class="py-1"
      >
        <GroupInfoCard :data="group" @ok="showGroupInfo" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GroupInfoCard from '~/components/GroupInfoCard.vue'
import CreateGroupForm from '~/components/CreateGroupForm.vue'
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'GroupPage',
  components: { GroupInfoCard, CreateGroupForm },
  middleware: authRouter,
  data() {
    return {
      pageLoading: false,
      groups: [],
      loading: false,
      createGroup: false,
    }
  },
  async created() {
    await this.getMyGroups()
  },
  methods: {
    showGroupInfo(payload) {
      this.$router.push(
        `/group/${payload.groupId.id}?name=${payload.groupId.name}`
      )
    },
    async getMyGroups() {
      this.pageLoading = true
      const groups = await FetchService.getMyGroups()
      if (groups) {
        this.pageLoading = false
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
        await this.getMyGroups()
        this.loading = false
        this.createGroup = false
      }
      this.loading = false
    },
  },
}
</script>

<style></style>
