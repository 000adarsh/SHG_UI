<template>
  <div>
    <div class="py-2">
      <h2 class="text-center">Groups of Users</h2>
      <v-divider></v-divider>
    </div>
    <div class="py-2">
      <v-row>
        <v-col
          v-for="(group, i) in groups"
          :key="i"
          cols="12"
          sm="6"
          lg="4"
          class="py-1"
        >
          <GroupInfoCard :data="group" @ok="usergroup" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import GroupInfoCard from '~/components/GroupInfoCard.vue'
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
    await this.getMyGroups()
  },
  methods: {
    usergroup(payload) {
      this.$router.push(
        `/users/${payload.groupId.id}?name=${payload.groupId.name}`
      )
    },
    async getMyGroups() {
      const groups = await FetchService.getMyGroups()
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
