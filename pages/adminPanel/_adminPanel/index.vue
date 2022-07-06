<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <div>
      <v-divider></v-divider>
      <v-simple-table v-if="isAccess" dense>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value(in ₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fundings</td>
            <td>{{ fundings }}</td>
          </tr>
          <tr>
            <td>Bank Credit Amount</td>
            <td>{{ creditBankAmount }}</td>
          </tr>
          <tr>
            <td>Bank Debit Amount</td>
            <td>{{ debitBankAmount }}</td>
          </tr>
          <tr>
            <td>Current Bank Balance</td>
            <td>{{ creditBankAmount - debitBankAmount }}</td>
          </tr>
          <tr>
            <td>Branch Inhand Amount</td>
            <td>{{ branchInhandAmount }}</td>
          </tr>
          <tr>
            <td>Active Loans</td>
            <td>{{ activeLoans }}</td>
          </tr>
          <tr>
            <td>Active Loan Installments</td>
            <td>{{ activeLoanInstallments }}</td>
          </tr>
          <tr>
            <td>Inactive Loans</td>
            <td>{{ inActiveLoans }}</td>
          </tr>
          <tr>
            <td>Inactive Loan Installments</td>
            <td>{{ inActiveLoanInstallments }}</td>
          </tr>
          <tr>
            <td>Total Inactive Loan Interest</td>
            <td>{{ inActiveLoanInstallments - inActiveLoans }}</td>
          </tr>
          <tr>
            <td>Savings</td>
            <td>{{ savings }}</td>
          </tr>
          <tr>
            <td>Group Expenses</td>
            <td>{{ groupExpenses }}</td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'

export default {
  name: 'GroupAdminPanel',
  middleware: authRouter,
  data() {
    return {
      isAccess: false,
      fundings: 0,
      savings: 0,
      activeLoans: 0,
      activeLoanInstallments: 0,
      inActiveLoans: 0,
      inActiveLoanInstallments: 0,
      debitBankAmount: 0,
      creditBankAmount: 0,
      groupExpenses: 0,
    }
  },
  computed: {
    branchInhandAmount() {
      const earning =
        this.fundings +
        this.savings +
        this.activeLoanInstallments +
        this.inActiveLoanInstallments
      const investment =
        this.activeLoans + this.inActiveLoans + this.groupExpenses
      const bankBalance = this.creditBankAmount - this.debitBankAmount
      return earning - investment - bankBalance
    },
  },
  created() {
    this.getGroupAdminPanel()
  },

  methods: {
    async getGroupAdminPanel() {
      const adminPanel = await FetchService.adminPanel({
        groupId: this.$route.params.adminPanel,
      })
      if (adminPanel) {
        this.$root.$emit('showNotification', adminPanel)
      }
      if (adminPanel.data.status === 'success') {
        this.isAccess = true
        this.fundings = adminPanel.data.fundings[0]?.total
          ? adminPanel.data.fundings[0].total
          : 0
        this.creditBankAmount = adminPanel.data.creditTransactions[0]?.total
          ? adminPanel.data.creditTransactions[0].total
          : 0
        this.debitBankAmount = adminPanel.data.debitTransactions[0]?.total
          ? adminPanel.data.debitTransactions[0].total
          : 0
        this.activeLoans = adminPanel.data.activeLoans[0]?.loan
          ? adminPanel.data.activeLoans[0].loan
          : 0
        this.activeLoanInstallments = adminPanel.data.activeLoans[0]
          ?.loanInstallment
          ? adminPanel.data.activeLoans[0].loanInstallment
          : 0
        this.inActiveLoans = adminPanel.data.inActiveLoans[0]?.loan
          ? adminPanel.data.inActiveLoans[0].loan
          : 0
        this.inActiveLoanInstallments = adminPanel.data.inActiveLoans[0]
          ?.loanInstallment
          ? adminPanel.data.inActiveLoans[0].loanInstallment
          : 0
        this.savings = adminPanel.data.savings[0]?.total
          ? adminPanel.data.savings[0].total
          : 0
        this.groupExpenses = adminPanel.data.groupExpenses[0]?.total
          ? adminPanel.data.groupExpenses[0].total
          : 0
      }
    },
  },
}
</script>

<style></style>
