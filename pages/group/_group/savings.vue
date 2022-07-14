<template>
  <div>
    <div>
      <h1 class="text-center">
        {{ $route.query.name.toUpperCase() }}
      </h1>
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
              <th class="pr-1">Creater</th>
              <th>User</th>
              <th class="px-1">Create Date</th>
              <th class="pl-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(saving, i) in groupSavings" :key="i">
              <td class="text-capitalize pr-1">{{ saving.createdBy.name }}</td>
              <td class="text-capitalize">{{ saving.userId.name }}</td>
              <td class="px-1">
                {{ $moment(saving.createDate).format('DD MMM YYYY') }}
              </td>
              <td class="pl-1">{{ saving.amount }}</td>
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
      this.getAllUsersGroupSavings()
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
