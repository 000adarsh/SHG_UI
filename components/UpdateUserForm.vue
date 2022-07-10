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
                (!!name && name.length > 2) || 'Name greater than 4 character',
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
                'Father Name greater than 4 character',
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
          <v-text-field
            v-model="note"
            label="Note"
            type="String"
            counter="100"
            clearable
          ></v-text-field>
          <v-select
            v-model="isActive"
            label=" Active Status"
            :items="[true, false]"
          ></v-select>
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
    user: {
      type: Object,
      default: () => {
        return {}
      },
    },
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
      note: null,
      isActive: null,
    }
  },
  mounted() {
    this.name = this.user?.name
    this.fatherName = this.user?.fatherName
    this.husbandName = this.user?.husbandName
    this.address = this.user?.address
    this.phone = this.user?.phone
    this.alternativePhone = this.user?.alternativePhone
    this.note = this.user?.note
    this.isActive = this.user?.isActive
  },
  methods: {
    createGroup() {
      this.$emit('submit', {
        name: this.name,
        fatherName: this.fatherName,
        husbandName: this.husbandName,
        address: this.address,
        phone: this.phone * 1,
        alternativePhone: this.alternativePhone * 1,
        note: this.note,
        isActive: this.isActive,
      })
    },
  },
}
</script>

<style></style>
