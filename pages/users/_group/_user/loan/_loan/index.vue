<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-card
        outlined
        @click="
          $router.push(
            `/users/${$route.params.group}/${$route.params.user}/loan/${$route.params.loan}/loanInstallment?name=${$route.query.name}`
          )
        "
        ><h3 class="pa-2 primary--text">Loan Installment</h3></v-card
      >
    </v-card-actions>
    <div class="pt-3 text-center">
      <h3>User Loan Details</h3>
      <v-divider></v-divider>
    </div>

    <v-simple-table v-if="loan"
      ><tbody class="text-capitalize">
        <tr>
          <td>Amount</td>
          <td>₹ {{ loan.amount }}</td>
        </tr>
        <tr>
          <td>Loan Interest Percentage</td>
          <td>{{ loan.loanInterestPercentage }} %</td>
        </tr>
        <tr>
          <td>Loan Created Date</td>
          <td>
            {{ $moment(loan.createdAt).format('DD MMM YYYY hh:mm:ss a') }}
          </td>
        </tr>
        <tr>
          <td>Loan Creater</td>
          <td>{{ loan.createdBy.name }}</td>
        </tr>
        <tr>
          <td>Loan Owner</td>
          <td>{{ loan.userId.name }}</td>
        </tr>
        <tr>
          <td>Loan Reason</td>
          <td>{{ loan.note }}</td>
        </tr>
      </tbody></v-simple-table
    >
    <v-divider></v-divider>
    <!-- <h3>
      Due -
      {{
        generatedLoanInstallmentData.length
          ? generatedLoanInstallmentData[
              generatedLoanInstallmentData.length - 1
            ].d
          : ''
      }}
    </h3> -->
    <div class="pt-3 text-center">
      <h3>User Loan Chart</h3>
      <v-divider></v-divider>
    </div>
    <v-simple-table v-if="generatedLoanInstallmentData.length">
      <thead>
        <tr>
          <th>Start Month</th>
          <th>End Month</th>
          <th>Principal</th>
          <th>Interest</th>
          <th>Installment</th>
          <th>Due</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d, i) in generatedLoanInstallmentData" :key="i">
          <td class="px-1">
            {{
              $moment
                .unix(dates[i] ? dates[i].startDate : '')
                .format('YYYY-MM-DD')
            }}
          </td>
          <td class="px-1">
            {{
              $moment
                .unix(dates[i] ? dates[i].endDate : '')
                .format('YYYY-MM-DD')
            }}
          </td>
          <td>{{ d.p }}</td>
          <td>{{ d.i }}</td>
          <td>{{ d.s }}</td>
          <td>{{ d.d }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-divider></v-divider>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'UserLoanDetailsPage',
  middleware: authRouter,
  data() {
    return {
      generatedLoanInstallmentData: [], // dont modify
      loan: null,
      months: [],
      dates: [],
      userLoanInstallments: [],
      filteredLoanInstallments: [],
    }
  },
  watch: {
    userLoanInstallments(oldDate, newdate) {
      this.filterInstallments()
    },
  },
  async created() {
    await this.getUserLoanDetails()
    await this.getAllUserLoanInstallments()
  },
  methods: {
    async getUserLoanDetails() {
      const loan = await FetchService.getUserLoanDetails({
        groupId: this.$route.params.group,
        userId: this.$route.params.user,
        loanId: this.$route.params.loan,
      })
      if (loan) {
        this.$root.$emit('showNotification', loan)
      }
      if (loan.data.status === 'success') {
        this.loan = loan.data.loan
        this.dateMaker({
          loanStartDate: this.loan.createdAt,
          currentDate: Date.now(),
        })
      }
    },
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
    generateLoanData({
      loanInterestPercentage,
      loanPrincipal,
      filteredLoanInstallments,
    }) {
      let p = loanPrincipal
      let genI = 0
      let ri = 0
      let i = 0
      let s = 0
      let d = loanPrincipal + i
      for (let c = 0; filteredLoanInstallments.length > c; c++) {
        let newP
        genI = p * loanInterestPercentage * 0.01
        i = ri + genI
        if (genI > filteredLoanInstallments[c].amount) {
          newP = p
        } else {
          newP = p - (filteredLoanInstallments[c].amount - i)
        }
        s = filteredLoanInstallments[c].amount
        d = p + i - s
        this.generatedLoanInstallmentData.push({ p, i, s, d, genI, ri })
        if (i > filteredLoanInstallments[c].amount) {
          ri = i - filteredLoanInstallments[c].amount
        } else {
          ri = 0
        }
        p = newP
      }
    },

    dateMaker({ loanStartDate, currentDate }) {
      let startDate = this.$moment(loanStartDate).unix()
      const j = this.$moment(currentDate).unix()
      let newStartDate = loanStartDate

      while (startDate < j) {
        const endDate = this.$moment(newStartDate).add(1, 'M').unix()
        this.dates.push({ startDate, endDate })
        startDate +=
          this.$moment(newStartDate).add(1, 'M').unix() -
          this.$moment(newStartDate).unix()
        newStartDate = this.$moment.unix(endDate).format()
      }
    },
    filterInstallments() {
      this.dates.forEach((e) => {
        let countInstallemts = 0
        this.userLoanInstallments.forEach((l) => {
          const time = parseInt(Date.parse(l.createdAt) * 0.001)
          if (time > e.startDate && time <= e.endDate) {
            countInstallemts += l.amount
          }
        })
        if (countInstallemts > 0) {
          this.filteredLoanInstallments.push({ amount: countInstallemts })
        } else {
          this.filteredLoanInstallments.push({ amount: 0 })
        }
      })
      this.generateLoanData({
        loanInterestPercentage: this.loan.loanInterestPercentage,
        loanPrincipal: this.loan.amount,
        filteredLoanInstallments: this.filteredLoanInstallments,
      })
    },
  },
}
</script>

<style></style>
