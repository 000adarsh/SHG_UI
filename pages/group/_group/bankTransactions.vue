<template>
  <div>
    <div>
      <v-overlay :value="pageLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </div>
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
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn outlined color="primary" @click="selectDateDialog = true"
        >select dates</v-btn
      >
    </v-card-actions>
    <v-dialog v-model="selectDateDialog" persistent width="900px">
      <v-card>
        <v-card-title>
          <span class="text-center">Select Dates</span>
        </v-card-title>
        <v-row class="mx-1">
          <v-col cols="12" sm="6" lg="6"
            ><v-dialog
              ref="startDateDialog"
              v-model="startDateDialog"
              :return-value.sync="selectedStartDate"
              persistent
              width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  :value="selectedStartDate"
                  label="From Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  outlined
                  required
                  :rules="[
                    (selectedStartDate) =>
                      !!selectedStartDate || 'From date is required',
                  ]"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="selectedStartDate"
                :active-picker.sync="startActivePicker"
                :max="$moment(Date.now()).format('YYYY-MM-DD')"
                min="2000-01-01"
                color="primary"
                @change="$refs.startDateDialog.save(selectedStartDate)"
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  outlined
                  color="primary"
                  @click="startDateDialog = false"
                >
                  Cancel
                </v-btn>
              </v-date-picker>
            </v-dialog></v-col
          >
          <v-col cols="12" sm="6" lg="6"
            ><v-dialog
              ref="endDateDialog"
              v-model="endDateDialog"
              :return-value.sync="selectedEndDate"
              persistent
              width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  :value="selectedEndDate"
                  label="To Date"
                  prepend-icon="mdi-calendar"
                  outlined
                  readonly
                  required
                  :rules="[
                    (selectedEndDate) =>
                      !!selectedEndDate || 'To date is required',
                  ]"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="selectedEndDate"
                :active-picker.sync="endActivePicker"
                :max="$moment(Date.now()).format('YYYY-MM-DD')"
                min="2000-01-01"
                color="primary"
                @change="$refs.endDateDialog.save(selectedEndDate)"
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  outlined
                  color="primary"
                  @click="endDateDialog = false"
                >
                  Cancel
                </v-btn>
              </v-date-picker>
            </v-dialog></v-col
          >
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            outlined
            color="primary"
            @click="selectDateDialog = false"
          >
            cancel
          </v-btn>
          <v-btn text outlined color="primary" @click="selectedDates()">
            ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      pageLoading: false,
      createTransactionDialog: false,
      loading: false,
      deleteLoading: false,
      clicked: '',
      transactions: [],
      selectDateDialog: false,
      startDate: null,
      endDate: null,
      selectedStartDate: this.$moment(Date.now())
        .subtract(1, 'months')
        .format('YYYY-MM-DD'),
      selectedEndDate: this.$moment(Date.now()).format('YYYY-MM-DD'),
      startDateDialog: false,
      endDateDialog: false,
      startActivePicker: null,
      endActivePicker: null,
    }
  },
  watch: {
    startDateDialog(val) {
      val && setTimeout(() => (this.startActivePicker = 'YEAR'))
    },
    endDateDialog(val) {
      val && setTimeout(() => (this.endActivePicker = 'YEAR'))
    },
  },
  async created() {
    await this.selectedDates()
  },
  methods: {
    async selectedDates() {
      const startDate = await this.$moment(this.selectedStartDate)
        .startOf('day')
        .toDate()
      const endDate = await this.$moment(this.selectedEndDate)
        .endOf('day')
        .toDate()
      this.startDate = startDate
      this.endDate = endDate
      this.selectDateDialog = false
      this.getBankTransactions()
    },
    async getBankTransactions() {
      this.pageLoading = true
      const transactions = await FetchService.getBankTransactions({
        groupId: this.$route.params.group,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      if (transactions) {
        this.pageLoading = false
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
