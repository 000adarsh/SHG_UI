<template>
  <div>
    <div>
      <h1 class="text-center">
        {{ $route.query.name.toUpperCase() }}
      </h1>
    </div>
    <v-card-actions
      ><v-btn
        text
        outlined
        color="primary"
        @click="createTransactionDialog = true"
        >create a Transaction</v-btn
      ></v-card-actions
    >

    <div>
      <v-dialog
        v-if="createTransactionDialog"
        :value="createTransactionDialog"
        persistent
        max-width="900px"
        ><CreateBankTransactionForm
          :loading="loading"
          @closeDialog="
            () => {
              createTransactionDialog = false
            }
          "
          @submit="createBankTransaction"
        />
      </v-dialog>
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
              @click="$refs.dialog.save(date) & getBankTransactions()"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col></v-row
    >
    <div>
      <h3 class="text-center">Group Bank Transactions</h3>
      <v-divider></v-divider>
      <div v-if="transactions.length">
        <v-simple-table
          ><thead>
            <tr>
              <th>Date</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Creater</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(transaction, i) in transactions" :key="i">
              <td class="pr-1">
                {{ $moment(transaction.createDate).format('DD MMM YYYY') }}
              </td>
              <td>
                {{
                  transaction.transactionType === 'credit'
                    ? transaction.amount
                    : ''
                }}
              </td>
              <td>
                {{
                  transaction.transactionType === 'debit'
                    ? transaction.amount
                    : ''
                }}
              </td>
              <td class="text-capitalize">{{ transaction.createdBy.name }}</td>
              <td>
                <v-btn
                  icon
                  outlined
                  color="error"
                  :loading="deleteLoading && clicked === i"
                  @click="deleteBankTransaction(transaction.id, i)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </td>
            </tr>
          </tbody></v-simple-table
        ><v-divider></v-divider>
      </div>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'GroupBankTransections',
  middleware: authRouter,
  data() {
    return {
      createTransactionDialog: false,
      loading: false,
      deleteLoading: false,
      clicked: '',
      transactions: [],
      picker: false,
      date: this.$moment(Date.now()).format('YYYY-MM'),
      startDate: null,
      endDate: null,
    }
  },

  async created() {
    await this.change(this.date)
    await this.getBankTransactions()
  },
  methods: {
    async change(x) {
      const startDate = await this.$moment(x).startOf('month').toDate()
      const endDate = await this.$moment(x).endOf('month').toDate()
      this.startDate = startDate
      this.endDate = endDate
    },
    async getBankTransactions() {
      const transactions = await FetchService.getBankTransactions({
        groupId: this.$route.params.group,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      if (transactions) {
        this.$root.$emit('showNotification', transactions)
      }
      if (transactions.data.status === 'success') {
        this.transactions = transactions.data.transactions
      }
    },
    async createBankTransaction(payload) {
      this.loading = true
      const transaction = await FetchService.createBankTransaction({
        groupId: this.$route.params.group,
        ...payload,
      })
      if (transaction) {
        this.$root.$emit('showNotification', transaction)
      }
      if (transaction.data.status === 'success') {
        await this.getBankTransactions()
        this.loading = false
        this.createTransactionDialog = false
      }
      this.loading = false
    },
    async deleteBankTransaction(id, i) {
      this.clicked = i
      this.deleteLoading = true
      const transaction = await FetchService.deleteBankTransaction({
        groupId: this.$route.params.group,
        bankTransactionId: id,
      })
      if (transaction) {
        this.$root.$emit('showNotification', transaction)
      }
      if (transaction.data.status === 'success') {
        await this.getBankTransactions()
        this.deleteLoading = false
      }
      this.deleteLoading = false
    },
  },
}
</script>

<style></style>
