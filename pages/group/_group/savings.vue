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
              @click="$refs.dialog.save(date) & getAllUsersGroupSavings()"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col></v-row
    >
    <div v-if="groupSavings.length">
      <div class="py-3">
        <v-simple-table dense
          ><thead>
            <tr>
              <th>Total Savings No</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ groupSavings.length }}</td>
              <td>{{ groupTotalAmount }}</td>
            </tr>
          </tbody></v-simple-table
        >
        <v-divider></v-divider>
      </div>
      <div class="py-3">
        <h3 class="text-center">Group Savings</h3>
        <v-divider></v-divider>
        <v-simple-table dense
          ><thead>
            <tr>
              <th>Creater</th>
              <th>User</th>
              <th>Create Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(saving, i) in groupSavings" :key="i">
              <td class="text-capitalize">{{ saving.createdBy.name }}</td>
              <td class="text-capitalize">{{ saving.userId.name }}</td>
              <td class="px-1">
                {{ $moment(saving.createDate).format('Do MMM YYYY') }}
              </td>
              <td>{{ saving.amount }}</td>
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
  name: 'GroupSavings',
  middleware: authRouter,
  data() {
    return {
      groupSavings: [],
      groupTotalAmount: null,
      picker: false,
      date: this.$moment(Date.now()).format('YYYY-MM'),
      startDate: null,
      endDate: null,
    }
  },
  async created() {
    await this.change(this.date)
    await this.getAllUsersGroupSavings()
  },
  methods: {
    async change(x) {
      const startDate = await this.$moment(x).startOf('month').toDate()
      const endDate = await this.$moment(x).endOf('month').toDate()
      this.startDate = startDate
      this.endDate = endDate
    },
    async getAllUsersGroupSavings() {
      const savings = await FetchService.getAllUsersGroupSavings({
        groupId: this.$route.params.group,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      if (savings) {
        this.$root.$emit('showNotification', savings)
      }
      if (savings.data.status === 'success') {
        this.groupSavings = savings.data.savings
        this.calculateAmount()
      }
    },
    calculateAmount() {
      let amount = 0
      this.groupSavings.forEach((e) => {
        amount += e.amount
      })
      this.groupTotalAmount = amount
    },
  },
}
</script>

<style></style>
