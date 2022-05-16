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
          <v-form ref="form" v-model="valid" class="px-4">
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
              ></v-text-field
              ><v-dialog
                ref="dialog"
                v-model="dateDialog"
                :return-value.sync="date"
                persistent
                width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    :value="date"
                    label="Saving Create Date*"
                    prepend-icon="mdi-calendar"
                    readonly
                    required
                    :rules="[
                      (date) => !!date || 'Saving Create date is required',
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
      <v-simple-table v-if="dueSaving" dense
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
      ><v-divider></v-divider>
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(saving, i) in savings" :key="i">
            <td class="text-capitalize">{{ saving.createdBy.name }}</td>
            <td class="px-1">
              {{ $moment(saving.createDate).format('DD MMM YYYY') }}
            </td>
            <td>{{ saving.amount }}</td>
            <td>
              <v-btn
                text
                outlined
                icon
                color="error"
                :loading="deleteLoading && clickedButton === i"
                @click="deleteUserSaving(saving.id, i)"
                ><v-icon>mdi-delete-forever</v-icon></v-btn
              >
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-divider></v-divider>
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
      deleteLoading: false,
      clickedButton: '',
      amount: null,
      savings: [],
      dueSaving: null,
      groupStartDate: null,
      groupSavingAmount: null,
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
    this.getUsergroup()
  },

  methods: {
    save(date) {
      this.$refs.dialog.save(date)
    },
    async deleteUserSaving(id, i) {
      this.clickedButton = i
      this.deleteLoading = true
      const saving = await FetchService.deleteUserSaving({
        savingId: id,
        userId: this.$route.params.user,
        groupId: this.$route.params.group,
      })
      if (saving) {
        this.$root.$emit('showNotification', saving)
      }
      if (saving.data.status === 'success') {
        await this.getAllUserSavings()
        this.deleteLoading = false
      }
      this.deleteLoading = false
    },
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
        createDate: this.$moment(this.date)
          .startOf('day')
          .add(6, 'hours')
          .toDate(),
      })
      if (saving) {
        this.$root.$emit('showNotification', saving)
      }
      if (saving.data.status === 'success') {
        await this.getAllUserSavings()
        this.loading = false
        this.addUserSaving = false
        this.$refs.form.reset()
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
      const dmonth = Math.abs(dueAmount / this.groupSavingAmount).toFixed(2)
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
