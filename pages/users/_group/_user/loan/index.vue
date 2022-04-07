<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <div class="py-3">
      <h3 class="text-center">User Loans</h3>
      <v-divider></v-divider>
    </div>
    <v-row v-if="loans.length"
      ><v-col v-for="(loan, i) in loans" :key="i" cols="12" sm="6" lg="4"
        ><v-card
          outlined
          :hover="true"
          @click="
            $router.push(
              `/users/${$route.params.group}/${$route.params.user}/loan/${loan.id}?name=${$route.query.name}`
            )
          "
          ><v-card-title>Loan Amount - {{ loan.amount }}</v-card-title
          ><v-card-subtitle class="py-0"
            >Created Date -
            {{
              $moment(loan.createdAt).format('DD MMM YYYY hh:mm:ss a')
            }}</v-card-subtitle
          ><v-card-subtitle class="py-0"
            >Creater - {{ loan.createdBy.name }}</v-card-subtitle
          ></v-card
        ></v-col
      ></v-row
    >
  </div>
</template>

<script>
import FetchService from '~/services/FetchService'
export default {
  name: 'UserLoanPage',
  data() {
    return {
      loans: [],
    }
  },
  async created() {
    await this.getAllUserLoans()
  },
  methods: {
    async getAllUserLoans() {
      const loans = await FetchService.getAllUserLoans({
        userId: this.$route.params.user,
        groupId: this.$route.params.group,
      })
      if (loans) {
        this.$root.$emit('showNotification', loans)
      }
      if (loans.data.status === 'success') {
        this.loans = loans.data.loans
      }
    },
  },
}
</script>

<style></style>
