<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <h3>
      Due -
      {{
        generatedLoanInstallmentData[generatedLoanInstallmentData.length - 1].d
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
export default {
  name: 'UserLoanDetailsPage',
  data() {
    return {
      generatedLoanInstallmentData: [], // dont modify
      loan: {
        createdAt: '2021-11-04T12:15:19.851+00:00', // fetch loan createdAt
        amount: 30000,
        loanInterestRate: 1,
      },
      months: [],
      dates: [],
      loanInstallments: [
        {
          createdAt: '2021-11-10T12:15:19.851+00:00',
          amount: 30000,
        },
        {
          createdAt: '2021-12-05T12:15:19.851+00:00',
          amount: 303,
        },
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
  created() {
    this.dateMaker({
      loanStartDate: this.loan.createdAt,
      currentDate: Date.now(),
    })
    // console.log(this.generatedLoanInstallmentData)
  },
  methods: {
    generateLoanData({
      loanInterestRate,
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
        genI = p * loanInterestRate * 0.01
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
      // this.filteredLoanInstallments.push({ amount: 0 })
      this.generateLoanData({
        loanInterestRate: this.loan.loanInterestRate,
        loanPrincipal: this.loan.amount,
        filteredLoanInstallments: this.filteredLoanInstallments,
      })
    },
  },
}
</script>

<style></style>
