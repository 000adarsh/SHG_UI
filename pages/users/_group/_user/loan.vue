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
    <v-simple-table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Principal</th>
          <th>Interest</th>
          <th>Installment</th>
          <th>Due</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d, i) in generatedLoanInstallmentData" :key="i">
          <td>{{ months[i] }}</td>
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
  name: 'UserLoanPage',
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
          amount: 1000,
        },
        {
          createdAt: '2021-12-05T12:15:19.851+00:00',
          amount: 200,
        },
        {
          createdAt: '2022-02-12T12:15:19.851+00:00',
          amount: 679,
        },
        {
          createdAt: '2022-03-15T12:15:19.851+00:00',
          amount: 10000,
        },
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
    this.getMonths({
      loanStartDate: this.loan.createdAt,
      currentDate: Date.now(),
    })
    console.log(this.generatedLoanInstallmentData)
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
    getMonths(payload) {
      let loanStartDate = this.$moment(payload.loanStartDate)
      const currentDate = this.$moment(payload.currentDate)
      while (loanStartDate.isBefore(currentDate)) {
        this.months.push(loanStartDate.format('YYYY-MM'))
        loanStartDate = loanStartDate.add(1, 'month')
      }
      this.dateMaker()
    },
    dateMaker() {
      this.months.forEach((e) => {
        const startDate = this.$moment(e).startOf('month').utc('00:00').unix()
        const endDate = this.$moment(e).endOf('month').utc('00:00').unix()
        this.dates.push({ startDate, endDate })
      })
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
      this.filteredLoanInstallments.push({ amount: 0 })
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
