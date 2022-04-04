<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <h1>user loan page</h1>
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
      fileredLoanInstallments: [
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
      loanStartDate: this.loanStartDate,
      currentDate: Date.now(),
    })

    // this.generateLoanData({
    //   loanInterestRate: this.loan.loanInterestRate,
    //   loanPrincipal: this.loan.amount,
    //   fileredLoanInstallments: this.fileredLoanInstallments,
    // })
    console.log(this.fileredLoanInstallments)
  },
  methods: {
    generateLoanData({
      loanInterestRate,
      loanPrincipal,
      fileredLoanInstallments,
    }) {
      let p = loanPrincipal
      let genI = 0
      let ri = 0
      let i = 0
      let s = 0
      let d = loanPrincipal + i
      for (let c = 0; fileredLoanInstallments.length > c; c++) {
        let newP
        genI = p * loanInterestRate * 0.01
        i = ri + genI
        if (genI > fileredLoanInstallments[c].amount) {
          newP = p
        } else {
          newP = p - (fileredLoanInstallments[c].amount - i)
        }
        s = fileredLoanInstallments[c].amount
        d = p + i - s
        this.generatedLoanInstallmentData.push({ p, i, s, d })
        if (i > fileredLoanInstallments[c].amount) {
          ri = i - fileredLoanInstallments[c].amount
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
      this.months.forEach(async (e) => {
        const startDate = await this.$moment(e)
          .startOf('month')
          .utc('00:00')
          .unix()
        const endDate = await this.$moment(e).endOf('month').utc('00:00').unix()
        this.dates.push({ startDate, endDate })
      })
    },
    filterInstallments() {},
  },
}
</script>

<style></style>
