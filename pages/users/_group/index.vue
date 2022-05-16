<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text outlined @click="createUser = true">
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
    <div class="pb-2">
      <h3 class="text-center">Group Users</h3>
      <v-divider></v-divider>
    </div>
    <div v-if="activeUsers.length" class="pb-2">
      <h2 class="text-center">Active Users</h2>
      <v-divider></v-divider>
    </div>
    <div class="py-2">
      <v-row>
        <v-col
          v-for="(user, i) in activeUsers"
          :key="i"
          cols="12"
          sm="6"
          lg="4"
          class="py-1"
        >
          <v-card
            outlined
            :hover="true"
            class="pl-4 py-1 text-capitalize"
            @click="userDetails(user)"
            ><h3>Name : {{ user.name }}</h3>
            <h4 v-if="!user.husbandName" class="text--secondary">
              Father Name : {{ user.fatherName }}
            </h4>
            <h4 v-if="user.husbandName" class="text--secondary">
              Husband Name : {{ user.husbandName }}
            </h4></v-card
          >
        </v-col></v-row
      >
    </div>
    <div v-if="inactiveUsers.length" class="pt-1">
      <h2 class="text-center">Inactive Users</h2>
      <v-divider></v-divider>
    </div>
    <div class="py-3">
      <v-row>
        <v-col
          v-for="(user, i) in inactiveUsers"
          :key="i"
          cols="12"
          sm="6"
          lg="4"
          class="py-1"
        >
          <v-card
            outlined
            :hover="true"
            class="pl-3 py-1 text-capitalize"
            @click="userDetails(user)"
            ><h3>Name : {{ user.name }}</h3>
            <h4 v-if="!user.husbandName" class="text--secondary">
              Father Name : {{ user.fatherName }}
            </h4>
            <h4 v-if="user.husbandName" class="text--secondary">
              Husband Name : {{ user.husbandName }}
            </h4></v-card
          >
        </v-col></v-row
      >
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import CreateUserForm from '~/components/CreateUserForm.vue'
import FetchService from '~/services/FetchService'
export default {
  name: 'UserPage',
  components: { CreateUserForm },
  middleware: authRouter,
  data() {
    return {
      users: [],
      createUser: false,
      loading: false,
    }
  },
  computed: {
    activeUsers() {
      return this.users.filter((u) => {
        return u.isActive
      })
    },
    inactiveUsers() {
      return this.users.filter((u) => {
        return !u.isActive
      })
    },
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
        await this.getAllGroupUsers(this.$route.params.group)
        this.loading = false
        this.createUser = false
      }
      this.loading = false
    },
    userDetails(user) {
      this.$router.push(
        `/users/${this.$route.params.group}/${user.id}?name=${user.name}&groupName=${this.$route.query.name}`
      )
    },
  },
}
</script>

<style></style>
