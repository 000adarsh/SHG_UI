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
    <div v-if="users.length" class="pb-3">
      <v-simple-table dense
        ><thead>
          <tr>
            <th class="pr-1">Name</th>
            <th class="px-1">Father Name</th>
            <th class="px-1">Husband Name</th>
            <th>Created Date</th>
            <th class="pl-1">Creater</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) in users" :key="i">
            <td class="text-capitalize pr-1">{{ user.name }}</td>
            <td class="text-capitalize px-1">
              {{ user ? user.fatherName : '' }}
            </td>
            <td class="text-capitalize px-1">
              {{ user ? user.husbandName : '' }}
            </td>
            <td class="px-1">
              {{ $moment(user.createDate).format('DD MMM YYYY') }}
            </td>
            <td class="text-capitalize pl-1">{{ user.createdBy.name }}</td>
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
