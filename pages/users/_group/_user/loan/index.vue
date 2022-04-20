<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text outlined color="primary" @click="createLoan = true"
        >create loan</v-btn
      >
    </v-card-actions>
    <v-dialog v-if="createLoan" :value="createLoan" persistent max-width="900"
      ><div>
        <v-card outlined
          ><v-form ref="form" v-model="valid" class="px-4"
            ><v-card-title class="justify-center pb-0">Create Loan</v-card-title
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
                label="Loan Amount*"
                clearable
              ></v-text-field
              ><v-text-field
                v-model="note"
                required
                :rules="[
                  (note) =>
                    (!!note && note.length > 5) ||
                    'note greater than 5 character',
                ]"
                label="Loan Reason Note*"
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
                    label="Select Create Date*"
                    prepend-icon="mdi-calendar"
                    readonly
                    required
                    :rules="[(date) => !!date || 'create date is required']"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" scrollable>
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
            ><v-btn text outlined color="success" @click="createLoan = false"
              >cancel</v-btn
            ><v-btn
              text
              outlined
              color="error"
              :disabled="!valid"
              :loading="loading"
              @click="createUserLoan"
              >ok</v-btn
            ></v-card-actions
          ></v-card
        >
      </div></v-dialog
    >
    <div class="py-3">
      <h3 class="text-center">User Loans</h3>
      <v-divider></v-divider>
    </div>
    <v-row v-if="loans.length"
      ><v-col v-for="(loan, i) in loans" :key="i" cols="12" sm="6" lg="4"
        ><v-card
          outlined
          :hover="true"
          @click="
            $router.push(
              `/users/${$route.params.group}/${$route.params.user}/loan/${loan.id}?name=${$route.query.name}`
            )
          "
          ><v-card-title>Loan Amount - {{ loan.amount }}</v-card-title
          ><v-card-subtitle class="py-0"
            >Created Date -
            {{
              $moment(loan.createDate).format('DD MMM YYYY hh:mm:ss a')
            }}</v-card-subtitle
          ><v-card-subtitle class="py-0"
            >Creater - {{ loan.createdBy.name }}</v-card-subtitle
          ></v-card
        ></v-col
      ></v-row
    >
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'UserLoanPage',
  middleware: authRouter,
  data() {
    return {
      loans: [],
      createLoan: false,
      amount: null,
      note: null,
      valid: false,
      loading: false,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateDialog: false,
    }
  },
  async created() {
    await this.getAllUserLoans()
  },
  methods: {
    async getAllUserLoans() {
      const loans = await FetchService.getAllUserLoans({
        userId: this.$route.params.user,
        groupId: this.$route.params.group,
      })
      if (loans) {
        this.$root.$emit('showNotification', loans)
      }
      if (loans.data.status === 'success') {
        this.loans = loans.data.loans
      }
    },
    async createUserLoan() {
      this.loading = true
      const loan = await FetchService.createUserLoan({
        userId: this.$route.params.user,
        groupId: this.$route.params.group,
        amount: this.amount,
        createDate: this.$moment(this.date)
          .startOf('day')
          .add(6, 'hours')
          .toDate(),
        note: this.note,
      })
      if (loan) {
        this.$root.$emit('showNotification', loan)
      }
      if (loan.data.status === 'success') {
        this.loading = false
        this.createLoan = false
        this.$refs.form.reset()
        this.getAllUserLoans()
      }
      this.loading = false
    },
  },
}
</script>

<style></style>
