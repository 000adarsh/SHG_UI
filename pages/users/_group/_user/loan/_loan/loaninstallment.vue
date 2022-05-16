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
              ></v-text-field>
              <v-dialog
                ref="dialog"
                v-model="dateDialog"
                :return-value.sync="date"
                persistent
                width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    :value="date"
                    label="Loan Installment Create Date*"
                    prepend-icon="mdi-calendar"
                    readonly
                    required
                    :rules="[
                      (date) =>
                        !!date || 'Loan Installment create date is required',
                    ]"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  :active-picker.sync="activePicker"
                  :max="
                    new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .substr(0, 10)
                  "
                  min="2000-01-01"
                  color="primary"
                  @change="save"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    outlined
                    color="primary"
                    @click="dateDialog = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    outlined
                    color="primary"
                    @click="$refs.dialog.save(date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-card-text></v-form
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
      <h3>User Loan Installments</h3>
      <v-divider></v-divider>
    </div>
    <v-simple-table v-if="userLoanInstallments.length"
      ><thead>
        <tr>
          <th>Creater</th>
          <th>Created Date</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(installment, i) in userLoanInstallments" :key="i">
          <td class="text-capitalize">
            {{ installment ? installment.createdBy.name : '' }}
          </td>
          <td class="px-1">
            {{
              $moment(installment ? installment.createDate : '').format(
                'DD MMM YYYY'
              )
            }}
          </td>
          <td>{{ installment ? installment.amount : '' }}</td>
          <td>
            <v-btn
              icon
              outlined
              small
              :loading="deleteLoading && buttonClicked === i"
              color="error"
              @click="deleteUserLoanInstallment(installment.id, i)"
              ><v-icon>mdi-delete-forever</v-icon></v-btn
            >
          </td>
        </tr>
      </tbody></v-simple-table
    >
    <v-divider></v-divider>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'UserLoanInstallmentPage',
  middleware: authRouter,
  data() {
    return {
      userLoanInstallments: [],
      createLoanInstallment: false,
      amount: null,
      valid: false,
      loading: false,
      deleteLoading: false,
      buttonClicked: '',
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateDialog: false,
      activePicker: null,
    }
  },
  watch: {
    dateDialog(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },
  created() {
    this.getAllUserLoanInstallments()
  },
  methods: {
    save(date) {
      this.$refs.dialog.save(date)
    },
    async deleteUserLoanInstallment(id, i) {
      this.buttonClicked = i
      this.deleteLoading = true
      const loanInstallment = await FetchService.deleteUserLoanInstallment({
        loanInstallmentId: id,
        groupId: this.$route.params.group,
        userId: this.$route.params.user,
        loanId: this.$route.params.loan,
      })
      if (loanInstallment) {
        this.$root.$emit('showNotification', loanInstallment)
      }
      if (loanInstallment.data.status === 'success') {
        await this.getAllUserLoanInstallments()
        this.deleteLoading = false
      }
      this.deleteLoading = false
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
    async createUserLoanInstallment() {
      this.loading = true
      const loanInstallment = await FetchService.createUserLoanInstallment({
        groupId: this.$route.params.group,
        userId: this.$route.params.user,
        loanId: this.$route.params.loan,
        createDate: this.$moment(this.date)
          .startOf('day')
          .add(6, 'hours')
          .toDate(),
        amount: this.amount,
      })
      if (loanInstallment) {
        this.$root.$emit('showNotification', loanInstallment)
      }
      if (loanInstallment.data.status === 'success') {
        await this.getAllUserLoanInstallments()
        this.loading = false
        this.createLoanInstallment = false
        this.$refs.form.reset()
      }
      this.loading = false
    },
  },
}
</script>

<style></style>
