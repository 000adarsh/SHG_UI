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
              @click="$refs.dialog.save(date) & getAllUsersGroupLoans()"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col></v-row
    >
    <div v-if="groupLoans.length">
      <div class="py-3">
        <v-simple-table
          ><thead>
            <tr>
              <th>Total loans No</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ groupLoans.length }}</td>
              <td>{{ groupTotalAmount }}</td>
            </tr>
          </tbody></v-simple-table
        >
        <v-divider></v-divider>
      </div>
      <div class="py-3">
        <h3 class="text-center">Group Loans</h3>
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
            <tr v-for="(loan, i) in groupLoans" :key="i">
              <td>{{ loan.createdBy.name }}</td>
              <td>{{ loan.userId.name }}</td>
              <td class="px-1">
                {{ $moment(loan.createDate).format('Do MMM YYYY, h:mm:ss a') }}
              </td>
              <td>{{ loan.amount }}</td>
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
  name: 'GroupLoans',
  middleware: authRouter,
  data() {
    return {
      groupLoans: [],
      groupTotalAmount: null,
      picker: false,
      date: this.$moment(Date.now()).format('YYYY-MM'),
      startDate: null,
      endDate: null,
    }
  },
  async created() {
    await this.change(this.date)
    await this.getAllUsersGroupLoans()
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
    async getAllUsersGroupLoans() {
      const loans = await FetchService.getAllUsersGroupLoans({
        groupId: this.$route.params.group,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      if (loans) {
        this.$root.$emit('showNotification', loans)
      }
      if (loans.data.status === 'success') {
        this.groupLoans = loans.data.loans
        this.calculateAmount()
      }
    },
    calculateAmount() {
      let amount = 0
      this.groupLoans.forEach((e) => {
        amount += e.amount
      })
      this.groupTotalAmount = amount
    },
  },
}
</script>

<style></style>
