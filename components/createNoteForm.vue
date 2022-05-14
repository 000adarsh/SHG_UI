<template>
  <v-container>
    <v-card>
      <v-form ref="form" v-model="valid" class="px-4">
        <div class="pt-3 pb-1">
          <h3 class="text-center">Note Details</h3>
          <v-divider></v-divider>
        </div>
        <v-card-text class="py-0">
          <v-text-field
            v-model="productName"
            label="Product Name*"
            required
            :rules="[
              (productName) =>
                (!!productName && productName.length > 2) ||
                'Product Name greater than 4 word ',
            ]"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="productCost"
            label="Product Cost*"
            type="number"
            required
            :rules="[
              (productCost) =>
                !!productCost > 0 || 'Product Cost greater than 0 ',
            ]"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="purchasePlace"
            label=" Product purchase place*"
            required
            :rules="[
              (purchasePlace) =>
                !!purchasePlace || 'Product Purchase Place is required ',
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
                label="Product Purchase Date*"
                prepend-icon="mdi-calendar"
                readonly
                :rules="[(date) => !!date || 'Purchase date is required ']"
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
          @click="createNote"
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
      productName: null,
      productCost: null,
      purchasePlace: null,
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
    createNote() {
      this.$emit('submit', {
        productName: this.productName,
        productCost: this.productCost,
        purchasePlace: this.purchasePlace,
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
