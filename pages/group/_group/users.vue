<template>
  <div>
    <div>
      <h1 class="text-center">
        {{ $route.query.name.toUpperCase() }}
      </h1>
    </div>
    <div class="py-2">
      <h3 class="text-center">Group Users</h3>
      <v-divider></v-divider>
    </div>
    <div v-if="users.length">
      <v-simple-table
        ><thead>
          <tr>
            <th>Name</th>
            <th>Father Name</th>
            <th>Husband Name</th>
            <th>Created Date</th>
            <th>Creater</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) in users" :key="i">
            <td class="text-capitalize">{{ user.name }}</td>
            <td class="text-capitalize">{{ user ? user.fatherName : '' }}</td>
            <td class="text-capitalize">{{ user ? user.husbandName : '' }}</td>
            <td class="px-1">
              {{ $moment(user.createDate).format('DD MMM YYYY hh:mm:ss a') }}
            </td>
            <td class="text-capitalize">{{ user.createdBy.name }}</td>
          </tr>
        </tbody></v-simple-table
      >
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'GroupUsers',
  middleware: authRouter,
  data() {
    return {
      users: [],
    }
  },

  created() {
    this.getAllGroupUsers()
  },
  methods: {
    async getAllGroupUsers() {
      const users = await FetchService.getAllGroupUsers({
        groupId: this.$route.params.group,
      })
      if (users) {
        this.$root.$emit('showNotification', users)
      }
      if (users.data.status === 'success') {
        this.users = users.data.users
      }
    },
  },
}
</script>

<style></style>
