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
        ><h3 class="pa-2">Loan Installment</h3></v-card
      >
    </v-card-actions>
    <div class="pt-3 text-center">
      <h3>User Loan Details</h3>
      <v-divider></v-divider>
    </div>
    <v-simple-table v-if="loan"
      ><tbody>
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
          <td class="text-capitalize">{{ loan.createdBy.name }}</td>
        </tr>
        <tr>
          <td>Loan Owner</td>
          <td class="text-capitalize">{{ loan.userId.name }}</td>
        </tr>
        <tr>
          <td>Loan Reason</td>
          <td>{{ loan.note }}</td>
        </tr>
      </tbody></v-simple-table
    >
    <h3>
      Due -
      {{
        generatedLoanInstallmentData.length
          ? generatedLoanInstallmentData[
              generatedLoanInstallmentData.length - 1
            ].d
          : ''
      }}
    </h3>
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
          <td>
            {{
              $moment
                .unix(dates[i] ? dates[i].startDate : '')
                .format('YYYY-MM-DD')
            }}
          </td>
          <td>
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
  </div>
</template>

<script>
import FetchService from '~/services/FetchService'
export default {
  name: 'UserLoanDetailsPage',
  data() {
    return {
      generatedLoanInstallmentData: [], // dont modify
      loan: null,
      months: [],
      dates: [],
      loanInstallments: [
        // {
        //   createdAt: '2021-11-10T12:15:19.851+00:00',
        //   amount: 30000,
        // },
        // {
        //   createdAt: '2021-12-05T12:15:19.851+00:00',
        //   amount: 303,
        // },
        // {
        //   createdAt: '2022-02-12T12:15:19.851+00:00',
        //   amount: 679,
        // },
        // {
        //   createdAt: '2022-03-15T12:15:19.851+00:00',
        //   amount: 10000,
        // },
        // {
        //   createdAt: '2022-04-04T04:20:29.751+00:00',
        //   amount: 1000,
        // },
        // {
        //   createdAt: '2022-04-05T10:28:38.558+00:00',
        //   amount: 100,
        // },
      ],
      filteredLoanInstallments: [
        // { amount: 1000 },
        // { amount: 200 },
        // { amount: 0 },
        // { amount: 679 },
        // { amount: 10000 },
        // { amount: 0 },
      ],
    }
  },
  async created() {
    await this.getUserLoanDetails()

    // console.log(this.generatedLoanInstallmentData)
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
      this.dates[this.dates.length - 1].endDate = j

      this.filterInstallments()
    },
    filterInstallments() {
      this.dates.forEach((e) => {
        let countInstallemts = 0
        this.loanInstallments.forEach((l) => {
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
