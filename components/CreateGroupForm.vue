<template>
  <v-container>
    <v-card>
      <v-form ref="form" v-model="valid" class="px-4">
        <div class="pt-3 pb-1">
          <h3 class="text-center">Group Details</h3>
          <v-divider></v-divider>
        </div>
        <v-card-text class="py-0">
          <v-text-field
            v-model="name"
            label="Name"
            required
            :rules="[
              (name) =>
                (!!name && name.length > 2) || 'Name greater than 4 word ',
            ]"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="address"
            label="Address"
            required
            :rules="[
              (address) =>
                (!!address && address.length > 4) ||
                'Address greater than 4 word ',
            ]"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="savingAmount"
            label=" Group Saving Amount"
            type="number"
            required
            :rules="[
              (savingAmount) => !!savingAmount || 'Saving Amount is required ',
            ]"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="loanInterestPercentage"
            type="number"
            :rules="[
              (loanInterestPercentage) =>
                (loanInterestPercentage > 0 && loanInterestPercentage <= 100) ||
                'Interest Percentage between 1 to 100 ',
            ]"
            label="Group Loan Interest"
            required
            clearable
          ></v-text-field>
          <v-dialog
            ref="dialog"
            v-model="startDateDialog"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Create and Work Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" color="primary" scrollable>
              <v-spacer></v-spacer>
              <v-btn
                text
                outlined
                color="primary"
                @click="startDateDialog = false"
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
        <v-btn text outlined color="primary" @click="$refs.form.reset()"
          >reset</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn color="error" text outlined @click="$emit('closeDialog')">
          Close
        </v-btn>
        <v-btn
          color="success"
          text
          outlined
          :disabled="!valid"
          :loading="loading"
          @click="createGroup"
        >
          submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      startDateDialog: false,
      valid: false,
      name: null,
      address: null,
      savingAmount: null,
      loanInterestPercentage: null,
    }
  },
  methods: {
    createGroup() {
      this.$emit('submit', {
        name: this.name,
        address: this.address,
        savingAmount: this.savingAmount * 1,
        startDate: this.$moment(this.date).startOf('day').toDate(),
        loanInterestPercentage: this.loanInterestPercentage * 1,
      })
      this.$refs.form.reset()
    },
  },
}
</script>

<style></style>
