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
          <v-select
            v-model="savingType"
            label="Saving Type"
            required
            :rules="[
              (savingType) => !!savingType || 'Saving Type is required ',
            ]"
            :items="['monthly', 'weekly']"
          ></v-select>
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
          <v-select
            v-model="loanInterestType"
            label="Loan Type"
            required
            :rules="[
              (loanInterestType) =>
                !!loanInterestType || 'Interest Type is required ',
            ]"
            :items="['monthly', 'weekly']"
          ></v-select>
        </v-card-text>
      </v-form>
      <v-card-actions>
        <v-btn text outlined @click="$refs.form.reset()">reset</v-btn>
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
          create
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
      valid: false,
      name: null,
      address: null,
      savingAmount: null,
      savingType: null,
      loanInterestPercentage: null,
      loanInterestType: null,
    }
  },
  methods: {
    createGroup() {
      this.$emit('submit', {
        name: this.name,
        address: this.address,
        savingAmount: this.savingAmount * 1,
        savingType: this.savingType,
        loanInterestPercentage: this.loanInterestPercentage * 1,
        loanInterestType: this.loanInterestType,
      })
    },
  },
}
</script>

<style></style>
