<template>
  <v-container pa-0>
    <v-card>
      <v-form ref="form" v-model="valid" lazy-validation class="px-4">
        <div class="pt-3 pb-1">
          <h3 class="text-center">Edit Employee Details</h3>
          <v-divider></v-divider>
        </div>
        <v-card-text class="py-0">
          <v-text-field v-model="name" label="Name" clearable></v-text-field>
          <v-text-field
            v-model="fatherName"
            label="FatherName"
            clearable
          ></v-text-field>
          <v-text-field v-model="role" label="Role" clearable></v-text-field>
          <v-text-field
            v-model="phone"
            label="Phone"
            counter
            type="Number"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="alternativePhone"
            label="AlternativePhone"
            counter
            type="Number"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="address"
            label="Address"
            clearable
          ></v-text-field>
          <v-select
            v-model="isActive"
            label="Active"
            :items="[true, false]"
          ></v-select>
        </v-card-text>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text outlined @click="$emit('closeDialog')">
          Close
        </v-btn>
        <v-btn
          color="success"
          text
          outlined
          :loading="loading"
          @click="updateDetails"
        >
          ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    employee: {
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
      role: null,
      phone: null,
      alternativePhone: null,
      address: null,
      isActive: null,
    }
  },
  created() {
    this.name = this.employee.name
    this.fatherName = this.employee.fatherName
    this.role = this.employee.role
    this.phone = this.employee.phone
    this.alternativePhone = this.employee.alternativePhone
    this.address = this.employee.address
    this.isActive = this.employee.isActive
  },
  methods: {
    updateDetails() {
      this.$emit('submit', {
        employeeId: this.employee.id,
        name: this.name,
        fatherName: this.fatherName,
        role: this.role,
        phone: this.phone,
        alternativePhone: this.alternativePhone,
        address: this.address,
        isActive: this.isActive,
      })
    },
  },
}
</script>

<style></style>
