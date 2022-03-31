<template>
  <div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" outlined @click="createUser = true">
        create new user
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-if="createUser"
      :value="createUser"
      persistent
      max-width="900px"
    >
      <CreateUserForm
        :loading="loading"
        @closeDialog="
          () => {
            createUser = false
          }
        "
        @submit="createNewUser"
      />
    </v-dialog>
    <div class="py-3">
      <h3 class="text-center">Group Users</h3>
      <v-divider></v-divider>
    </div>
    <v-row class="pt-2">
      <v-col v-for="(user, i) in users" :key="i" cols="12" sm="6" lg="4">
        <v-card outlined :hover="true" @click="userDetails(user)"
          ><v-card-title>Name : {{ user.name }}</v-card-title>
          <v-card-subtitle v-if="!user.husbandName"
            >Father Name : {{ user.fatherName }}</v-card-subtitle
          ><v-card-subtitle
            >Husband Name : {{ user.husbandName }}</v-card-subtitle
          ></v-card
        >
      </v-col></v-row
    >
  </div>
</template>

<script>
import CreateUserForm from '~/components/CreateUserForm.vue'
import FetchService from '~/services/FetchService'
export default {
  name: 'UserPage',
  components: { CreateUserForm },
  data() {
    return {
      users: [],
      createUser: false,
      loading: false,
    }
  },
  async created() {
    await this.getAllGroupUsers(this.$route.params.group)
  },
  methods: {
    async getAllGroupUsers(id) {
      const users = await FetchService.getAllGroupUsers({ groupId: id })
      if (users) {
        this.$root.$emit('showNotification', users)
      }
      if (users.data.status === 'success') {
        this.users = users.data.users
      }
    },
    async createNewUser(payload) {
      this.loading = true
      const user = await FetchService.createUser({
        ...payload,
        groupId: this.$route.params.group,
      })
      if (user) {
        this.$root.$emit('showNotification', user)
      }
      if (user.data.status === 'success') {
        this.loading = false
        this.createUser = false
        await this.getAllGroupUsers(this.$route.params.group)
      }
      this.loading = false
    },
    userDetails(user) {
      this.$router.push(`/users/${this.$route.params.group}/${user.id}`)
    },
  },
}
</script>

<style></style>
