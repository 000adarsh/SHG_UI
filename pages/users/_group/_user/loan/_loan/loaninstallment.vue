<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <div class="py-3 text-center">
      <h3>User Loan Saving Installment</h3>
      <v-divider></v-divider>
    </div>
    <v-simple-table v-if="userLoanInstallments.length"
      ><thead>
        <tr>
          <th>Creater</th>
          <th>Created Date</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(installment, i) in userLoanInstallments" :key="i">
          <td class="text-capitalize">
            {{ installment ? installment.createdBy.name : '' }}
          </td>
          <td>{{ installment ? installment.createdAt : '' }}</td>
          <td>{{ installment ? installment.amount : '' }}</td>
        </tr>
      </tbody></v-simple-table
    >
  </div>
</template>

<script>
import FetchService from '~/services/FetchService'
export default {
  name: 'UserLoanInstallmentPage',
  data() {
    return {
      startDate: '2021-11-04T01:00:00.000+00:00',
      userLoanInstallments: [],
    }
  },
  created() {
    this.getAllUserLoanInstallments()
  },
  methods: {
    async getAllUserLoanInstallments() {
      const userLoanInstallments =
        await FetchService.getAllUserLoanInstallments({
          groupId: this.$route.params.group,
          userId: this.$route.params.user,
          loanId: this.$route.params.loan,
        })
      if (userLoanInstallments) {
        this.$root.$emit('showNotification', userLoanInstallments)
      }
      if (userLoanInstallments.data.status === 'success') {
        this.userLoanInstallments =
          userLoanInstallments.data.userLoanInstallments
      }
    },
  },
}
</script>

<style></style>
