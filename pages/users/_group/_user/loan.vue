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
      generatedLoanInstallmentData: [],
    }
  },
  created() {
    this.generateLoanData({
      loanInterestRate: 1,
      loanPrincipal: 30000,
      loanInstallments: [
        { amount: 1000 },
        { amount: 200 },
        { amount: 0 },
        { amount: 679 },
        { amount: 10000 },
        { amount: 0 },
      ],
    })
    console.log(this.generatedLoanInstallmentData)
  },
  methods: {
    generateLoanData({ loanInterestRate, loanPrincipal, loanInstallments }) {
      let p = loanPrincipal
      let genI = 0
      let ri = 0
      let i = 0
      let s = 0
      let d = loanPrincipal + i
      for (let c = 0; loanInstallments.length > c; c++) {
        let newP
        genI = p * loanInterestRate * 0.01
        i = ri + genI
        if (genI > loanInstallments[c].amount) {
          newP = p
        } else {
          newP = p - (loanInstallments[c].amount - i)
        }
        s = loanInstallments[c].amount
        d = p + i - s
        this.generatedLoanInstallmentData.push({ p, i, s, d })
        if (i > loanInstallments[c].amount) {
          ri = i - loanInstallments[c].amount
        } else {
          ri = 0
        }
        p = newP
      }
    },
  },
}
</script>

<style></style>
