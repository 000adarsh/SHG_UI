<template>
  <v-container>
    <v-card>
      <v-form ref="form" v-model="valid" class="px-4">
        <div class="py-2">
          <h3 class="text-center">User Details</h3>
          <v-divider></v-divider>
        </div>
        <v-card-text class="py-0">
          <v-text-field
            v-model="name"
            label="Name*"
            required
            :rules="[
              (name) =>
                (!!name && name.length > 2) || 'Name greater than 2 character',
            ]"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="fatherName"
            label="Father Name*"
            required
            :rules="[
              (fatherName) =>
                (!!fatherName && fatherName.length > 2) ||
                'Father Name greater than 2 character',
            ]"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="address"
            label="Address*"
            required
            :rules="[
              (address) =>
                (!!address && address.length > 4) ||
                'Address is greater than 4 character',
            ]"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="husbandName"
            label="Husband Name"
            :rules="[
              (husbandName) => {
                if (husbandName)
                  return (
                    (!!husbandName && husbandName.length > 2) ||
                    'Husband Name greater than 2 character'
                  )
                else return true
              },
            ]"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="phone"
            label=" Mobile No"
            type="number"
            counter
            clearable
          ></v-text-field>
          <v-text-field
            v-model="alternativePhone"
            label=" Alternative Mobile No"
            type="number"
            counter
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
                :value="date"
                label="Select Join Date*"
                prepend-icon="mdi-calendar"
                readonly
                required
                :rules="[(date) => !!date || 'join date is required']"
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
        <v-btn color="primary" text outlined @click="$refs.form.reset()"
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
      valid: false,
      name: null,
      fatherName: null,
      husbandName: null,
      address: null,
      phone: null,
      alternativePhone: null,
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
  methods: {
    save(date) {
      this.$refs.dialog.save(date)
    },
    createGroup() {
      this.$emit('submit', {
        name: this.name,
        fatherName: this.fatherName,
        husbandName: this.husbandName,
        address: this.address,
        phone: this.phone * 1,
        alternativePhone: this.alternativePhone * 1,
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
