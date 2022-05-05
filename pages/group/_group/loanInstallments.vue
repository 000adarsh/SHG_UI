<template>
  <div>
    <div>
      <h1 class="text-center">
        {{ $route.query.name.toUpperCase() }}
      </h1>
    </div>
    <v-row class="pt-3">
      <v-spacer></v-spacer
      ><v-col cols="12" sm="4" lg="4">
        <v-dialog
          ref="dialog"
          v-model="picker"
          :return-value.sync="date"
          persistent
          width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Select Month"
              prepend-icon="mdi-calendar"
              readonly
              dense
              outlined
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            type="month"
            color="success"
            header-color="error"
            scrollable
            @change="change"
          >
            <v-spacer></v-spacer>
            <v-btn text outlined color="primary" @click="picker = false">
              Cancel
            </v-btn>
            <v-btn
              text
              outlined
              color="primary"
              @click="
                $refs.dialog.save(date) & getAllUsersGroupLoanInstallments()
              "
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col></v-row
    >
    <div v-if="loanInstallments.length">
      <div class="py-3">
        <v-simple-table
          ><thead>
            <tr>
              <th>Total Loan Installment</th>
              <th>Total Loan Installment Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ loanInstallments.length }}</td>
              <td>{{ groupTotalAmount }}</td>
            </tr>
          </tbody></v-simple-table
        >
        <v-divider></v-divider>
      </div>
      <div class="py-3">
        <h3 class="text-center">Group Loans Installments</h3>
        <v-divider></v-divider>
        <v-simple-table
          ><thead>
            <tr>
              <th>Creater</th>
              <th>User</th>
              <th>Create Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(loanInstallment, i) in loanInstallments" :key="i">
              <td>{{ loanInstallment.createdBy.name }}</td>
              <td>{{ loanInstallment.userId.name }}</td>
              <td class="px-1">
                {{
                  $moment(loanInstallment.createDate).format(
                    'Do MMM YYYY, h:mm:ss a'
                  )
                }}
              </td>
              <td>{{ loanInstallment.amount }}</td>
            </tr>
          </tbody></v-simple-table
        >
        <v-divider></v-divider>
      </div>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'

export default {
  name: 'GroupLoanInstallments',
  middleware: authRouter,
  data() {
    return {
      loanInstallments: [],
      groupTotalAmount: null,
      picker: false,
      date: this.$moment(Date.now()).format('YYYY-MM'),
      startDate: null,
      endDate: null,
    }
  },
  async created() {
    await this.change(this.date)
    await this.getAllUsersGroupLoanInstallments()
  },
  methods: {
    async change(x) {
      const startDate = await this.$moment(x)
        .startOf('month')
        .add(new Date().getTimezoneOffset(), 'minutes')
        .utc('+00:00')
        .toDate()
      const endDate = await this.$moment(x)
        .endOf('month')
        .add(new Date().getTimezoneOffset(), 'minutes')
        .utc('+00:00')
        .toDate()
      this.startDate = startDate
      this.endDate = endDate
    },
    async getAllUsersGroupLoanInstallments() {
      const loanInstallments =
        await FetchService.getAllUsersGroupLoanInstallments({
          groupId: this.$route.params.group,
          startDate: this.startDate,
          endDate: this.endDate,
        })
      if (loanInstallments) {
        this.$root.$emit('showNotification', loanInstallments)
      }
      if (loanInstallments.data.status === 'success') {
        this.loanInstallments = loanInstallments.data.loanInstallments
        this.calculateAmount()
      }
    },
    calculateAmount() {
      let amount = 0
      this.loanInstallments.forEach((e) => {
        amount += e.amount
      })
      this.groupTotalAmount = amount
    },
  },
}
</script>

<style></style>
