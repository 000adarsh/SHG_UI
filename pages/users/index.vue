<template>
  <div>
    <div class="py-3">
      <h2 class="text-center">Groups of Users</h2>
      <v-divider></v-divider>
    </div>
    <v-row>
      <v-col v-for="(group, i) in groups" :key="i" cols="12" sm="6" lg="4">
        <GroupInfoCard :data="group" @ok="usergroup" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GroupInfoCard from '~/components/gorupInfoCard.vue'
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'UserPage',
  components: { GroupInfoCard },
  middleware: authRouter,
  data() {
    return {
      groups: [],
    }
  },
  async created() {
    await this.getEmployeeGroups()
  },
  methods: {
    usergroup(payload) {
      this.$router.push(`/users/${payload.groupId.id}`)
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
  },
}
</script>

<style></style>
