<template>
  <v-container>
    <v-card>
      <v-form ref="form" v-model="valid" class="px-4">
        <div class="pt-3 pb-1">
          <h3 class="text-center">Funding Details</h3>
          <v-divider></v-divider>
        </div>
        <v-card-text class="py-0">
          <v-text-field
            v-model="amount"
            label="Funding Amount*"
            type="number"
            hide-spin-buttons
            required
            :rules="[
              (amount) =>
                !!amount > 0 || 'Amount is required & greater than 0 ',
            ]"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="donator"
            label="Donator*"
            required
            :rules="[
              (donator) =>
                (!!donator && donator.length > 4) ||
                'Donator name greater than 4 character ',
            ]"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="note"
            label="Note"
            required
            :rules="[
              (note) => {
                if (note)
                  return note.length > 4 || 'Note is greater than 4 character '
                else return true
              },
            ]"
            clearable
          ></v-text-field>

          <v-dialog
            ref="dialog"
            v-model="dateDialog"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Fund given Date*"
                prepend-icon="mdi-calendar"
                readonly
                :rules="[(date) => !!date || 'Funding date is required ']"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              :active-picker.sync="activePicker"
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substr(0, 10)
              "
              min="2000-01-01"
              color="primary"
              @change="save"
            >
              <v-spacer></v-spacer>
              <v-btn text outlined color="primary" @click="dateDialog = false">
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
          @click="createFunding"
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
      dateDialog: false,
      activePicker: null,
      valid: false,
      amount: null,
      donator: null,
      note: null,
    }
  },
  watch: {
    dateDialog(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },
  methods: {
    save(date) {
      this.$refs.dialog.save(date)
    },
    createFunding() {
      this.$emit('submit', {
        amount: this.amount,
        donator: this.donator,
        note: this.note,
        createDate: this.$moment(this.date)
          .startOf('day')
          .add(6, 'hours')
          .toDate(),
      })
    },
  },
}
</script>

<style></style>
