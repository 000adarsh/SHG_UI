<template>
  <div>
    <div>
      <h1 class="text-center text-uppercase">
        {{ $route.query.name }}
      </h1>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text outlined @click="addUserSaving = true">
        add saving
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-if="addUserSaving"
      :value="addUserSaving"
      persistent
      max-width="900px"
      ><v-container>
        <v-card>
          <v-form v-model="valid" class="px-4">
            <v-card-text class="py-0">
              <v-text-field
                v-model="amount"
                type="number"
                label="Saving Amount"
                required
                :rules="[
                  (amount) =>
                    (!!amount && amount > 0) || 'Amount greater than 0 ',
                ]"
                clearable
              ></v-text-field>
            </v-card-text>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text outlined @click="addUserSaving = false">
              Close
            </v-btn>
            <v-btn
              color="success"
              text
              outlined
              :disabled="!valid"
              :loading="loading"
              @click="createUserSaving"
            >
              submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>
    <div class="py-3">
      <h3 class="text-center">Due User Savings</h3>
      <v-divider></v-divider>
      <v-simple-table v-if="dueSaving"
        ><thead>
          <tr>
            <th>Month</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ dueSaving.months }}</td>
            <td>{{ dueSaving.amount }}</td>
          </tr>
        </tbody></v-simple-table
      >
    </div>
    <div class="py-3">
      <h3 class="text-center">User Savings</h3>
      <v-divider></v-divider>
      <v-simple-table v-if="savings.length">
        <thead>
          <tr>
            <th>Creater</th>
            <th>Create Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(saving, i) in savings" :key="i">
            <td class="text-capitalize">{{ saving.createdBy.name }}</td>
            <td class="px-1">
              {{ $moment(saving.createdAt).format('Do MMM YYYY, h:mm:ss a') }}
            </td>
            <td>{{ saving.amount }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'UserSavingPage',
  middleware: authRouter,
  data() {
    return {
      valid: false,
      addUserSaving: false,
      loading: false,
      amount: null,
      savings: [],
      dueSaving: null,
      groupStartDate: null,
      groupSavingAmount: null,
    }
  },
  created() {
    this.getUsergroup()
  },

  methods: {
    async getUsergroup() {
      const group = await FetchService.getGroup({
        groupId: this.$route.params.group,
      })
      if (group.data.status === 'success') {
        this.groupStartDate = group.data.group.startDate
        this.groupSavingAmount = group.data.group.savingAmount
        await this.getAllUserSavings()
      }
    },
    async getAllUserSavings() {
      const savings = await FetchService.getAllUserSavings({
        userId: this.$route.params.user,
        groupId: this.$route.params.group,
      })
      if (savings) {
        this.$root.$emit('showNotification', savings)
      }
      if (savings.data.status === 'success') {
        this.savings = savings.data.savings
        this.getDueSaving()
      }
    },
    async createUserSaving() {
      this.loading = true
      const saving = await FetchService.createUserSaving({
        userId: this.$route.params.user,
        groupId: this.$route.params.group,
        amount: this.amount,
      })
      if (saving) {
        this.$root.$emit('showNotification', saving)
      }
      if (saving.data.status === 'success') {
        this.loading = false
        this.amount = null
        this.addUserSaving = false
        await this.getAllUserSavings()
      }
      this.loading = false
    },
    async getDueSaving() {
      const months = await this.getMonths({
        groupStartDate: this.groupStartDate,
        currentDate: Date.now(),
      })
      const totalUserSaving = this.calculateSavings({
        userSavings: this.savings,
      })
      const totalGroupSaving = months * this.groupSavingAmount
      const dueAmount = totalGroupSaving - totalUserSaving
      const dmonth = Math.abs(dueAmount / this.groupSavingAmount)
      this.dueSaving = { months: dmonth, amount: dueAmount }
    },
    getMonths({ groupStartDate, currentDate }) {
      let startDate = this.$moment(groupStartDate).unix()
      const lastDate = this.$moment(currentDate).unix()
      let newStartDate = groupStartDate
      let month = 0
      while (startDate < lastDate) {
        const endDate = this.$moment(newStartDate).add(1, 'M').unix()
        month = month + 1
        startDate +=
          this.$moment(newStartDate).add(1, 'M').unix() -
          this.$moment(newStartDate).unix()
        newStartDate = this.$moment.unix(endDate).format()
      }
      return month
    },
    calculateSavings(payload) {
      let allSavings = 0
      payload.userSavings.forEach((e) => {
        allSavings = allSavings + e.amount
      })
      return allSavings
    },
  },
}
</script>

<style></style>
