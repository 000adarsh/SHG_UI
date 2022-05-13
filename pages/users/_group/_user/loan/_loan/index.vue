<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>

    <v-card-actions class="px-0">
      <v-btn text outlined color="error" @click="deleteUserLoanPopup = true"
        >delete loan</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn
        text
        outlined
        color="primary"
        @click="
          $router.push(
            `/users/${$route.params.group}/${$route.params.user}/loan/${$route.params.loan}/loanInstallment?name=${$route.query.name}`
          )
        "
        >Loan Installment</v-btn
      >
    </v-card-actions>
    <v-dialog
      v-if="deleteUserLoanPopup"
      :value="deleteUserLoanPopup"
      persistent
      max-width="600"
      ><v-card
        ><v-card-title>Are you sure to want to delete this loan?</v-card-title
        ><v-card-actions
          ><v-spacer></v-spacer
          ><v-btn
            text
            outlined
            color="success"
            @click="deleteUserLoanPopup = false"
            >no</v-btn
          ><v-btn
            text
            outlined
            color="error"
            :loading="deleteLoanLoading"
            @click="deleteUserLoan"
            >yes</v-btn
          ></v-card-actions
        ></v-card
      >
    </v-dialog>
    <div class="pt-2 text-center">
      <h3>User Loan Details</h3>
      <v-divider></v-divider>
    </div>

    <v-simple-table v-if="loan" dense
      ><tbody class="text-capitalize">
        <tr>
          <td>Amount</td>
          <td>₹ {{ loan.amount }}</td>
        </tr>
        <tr>
          <td>Loan Interest Percentage</td>
          <td>{{ loan.loanInterestPercentage }} % Monthly</td>
        </tr>
        <tr>
          <td>Loan Created Date</td>
          <td>
            {{ $moment(loan.createDate).format('DD MMM YYYY') }}
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
        <tr>
          <td>Loan Status</td>
          <td>{{ loan.isActive }}</td>
        </tr>
      </tbody></v-simple-table
    >
    <v-divider></v-divider>
    <div class="pt-3 text-center">
      <h3>User Loan Chart</h3>
      <v-divider></v-divider>
    </div>
    <v-simple-table v-if="generatedLoanInstallmentData.length" dense>
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
          <td class="pr-1">
            {{
              $moment
                .unix(dates[i] ? dates[i].startDate : '')
                .format('DD-MM-YYYY')
            }}
          </td>
          <td class="px-1">
            {{
              $moment
                .unix(dates[i] ? dates[i].endDate : '')
                .format('DD-MM-YYYY')
            }}
          </td>
          <td>{{ d.p }}</td>
          <td>{{ d.i }}</td>
          <td>{{ d.installment }}</td>
          <td>{{ d.due }}</td>
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
      deleteUserLoanPopup: false,
      deleteLoanLoading: false,
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
    async deleteUserLoan() {
      this.deleteLoanLoading = true
      const loan = await FetchService.deleteUserLoan({
        groupId: this.$route.params.group,
        userId: this.$route.params.user,
        loanId: this.$route.params.loan,
      })
      if (loan) {
        this.$root.$emit('showNotification', loan)
      }
      if (loan.data.status === 'success') {
        this.deleteLoanLoading = false
        this.$router.replace(
          `/users/${this.$route.params.group}/${this.$route.params.user}/loan?name=${this.$route.query.name}`
        )
      }
      this.deleteLoanLoading = false
    },
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
          loanStartDate: this.loan.createDate,
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
    async generateLoanData({
      loanInterestPercentage,
      loanPrincipal,
      filteredLoanInstallments,
    }) {
      let p = loanPrincipal
      let genI = 0
      let ri = 0 // remaining interest
      let i = 0
      let installment = 0
      let due = loanPrincipal + i
      for (let c = 0; filteredLoanInstallments.length > c; c++) {
        let newP
        genI = Math.round(p * loanInterestPercentage * 0.01)
        i = Math.round(ri + genI)
        if (i > filteredLoanInstallments[c].amount) {
          newP = Math.round(p)
        } else {
          newP = Math.round(p - (filteredLoanInstallments[c].amount - i))
        }
        installment = Math.round(filteredLoanInstallments[c].amount)
        due = Math.round(p + i - installment)
        this.generatedLoanInstallmentData.push({
          p,
          i,
          installment,
          due,
          genI,
          ri,
        })

        if (due <= 0) {
          if (this.loan.isActive) {
            await FetchService.updateUserLoanStatus({
              groupId: this.$route.params.group,
              loanId: this.$route.params.loan,
              isActive: false,
            })
          }
          return
        }
        if (i > filteredLoanInstallments[c].amount) {
          ri = i - filteredLoanInstallments[c].amount
        } else {
          ri = 0
        }
        p = newP
      }
      if (due >= 0) {
        if (!this.loan.isActive) {
          await FetchService.updateUserLoanStatus({
            groupId: this.$route.params.group,
            loanId: this.$route.params.loan,
            isActive: true,
          })
        }
      }
    },

    dateMaker({ loanStartDate, currentDate }) {
      let startDate = this.$moment(loanStartDate).unix()
      const j = this.$moment(currentDate).unix()
      let newStartDate = loanStartDate

      while (startDate < j) {
        const endDate = this.$moment(newStartDate).add(1, 'M').unix() - 1
        this.dates.push({ startDate, endDate })
        startDate +=
          this.$moment(newStartDate).add(1, 'M').unix() -
          this.$moment(newStartDate).unix()
        newStartDate = this.$moment.unix(endDate + 1).format()
      }
    },
    filterInstallments() {
      this.dates.forEach((e) => {
        let countInstallemts = 0
        this.userLoanInstallments.forEach((l) => {
          const time = parseInt(Date.parse(l.createDate) * 0.001)
          if (time >= e.startDate && time <= e.endDate) {
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
