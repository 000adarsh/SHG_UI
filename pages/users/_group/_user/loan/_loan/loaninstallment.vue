<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <v-card-actions
      ><v-spacer></v-spacer
      ><v-btn
        text
        outlined
        color="primary"
        @click="createLoanInstallment = true"
        >create installment</v-btn
      ></v-card-actions
    >
    <v-dialog
      v-if="createLoanInstallment"
      :value="createLoanInstallment"
      persistent
      max-width="900"
      ><div>
        <v-card outlined
          ><v-form ref="form" v-model="valid" class="px-4"
            ><v-card-title class="justify-center pb-0"
              >Create Loan Installment</v-card-title
            ><v-divider></v-divider
            ><v-card-text class="py-0">
              <v-text-field
                v-model="amount"
                required
                type="number"
                :rules="[
                  (amount) =>
                    (!!amount && amount > 0) || 'amount greater than 0',
                ]"
                label="Loan Installment Amount"
                clearable
              ></v-text-field></v-card-text></v-form
          ><v-card-actions
            ><v-spacer></v-spacer
            ><v-btn
              text
              outlined
              color="success"
              @click="createLoanInstallment = false"
              >cancel</v-btn
            ><v-btn
              text
              outlined
              color="error"
              :disabled="!valid"
              :loading="loading"
              @click="createUserLoanInstallment"
              >ok</v-btn
            ></v-card-actions
          ></v-card
        >
      </div></v-dialog
    >
    <div class="pt-3 text-center">
      <h3>User Loan Saving Installment</h3>
      <v-divider></v-divider>
    </div>
    <v-simple-table v-if="userLoanInstallments.length"
      ><thead>
        <tr>
          <th>Creater</th>
          <th>Created Date</th>
          <th>Amount</th>
          <!-- <th></th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(installment, i) in userLoanInstallments" :key="i">
          <td class="text-capitalize">
            {{ installment ? installment.createdBy.name : '' }}
          </td>
          <td class="px-1">
            {{
              $moment(installment ? installment.createdAt : '').format(
                'DD MMM YYYY hh:mm:ss a'
              )
            }}
          </td>
          <td>{{ installment ? installment.amount : '' }}</td>
          <!-- <td>
            <v-btn text outlined small color="primary"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
          </td> -->
        </tr>
      </tbody></v-simple-table
    >
    <v-divider></v-divider>
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
      createLoanInstallment: false,
      amount: null,
      valid: false,
      loading: false,
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
    async createUserLoanInstallment() {
      this.loading = true
      const loanInstallment = await FetchService.createUserLoanInstallment({
        groupId: this.$route.params.group,
        userId: this.$route.params.user,
        loanId: this.$route.params.loan,
        amount: this.amount,
      })
      if (loanInstallment) {
        this.$root.$emit('showNotification', loanInstallment)
      }
      if (loanInstallment.data.status === 'success') {
        this.loading = false
        this.createLoanInstallment = false
        await this.getAllUserLoanInstallments()
      }
      this.loading = false
    },
  },
}
</script>

<style></style>
