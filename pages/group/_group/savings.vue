<template>
  <div>
    <h3 class="text-center">Group Details</h3>
    <v-divider></v-divider>
    <v-simple-table>
      <tbody>
        <tr>
          <td>Group Name</td>
          <td>{{}}</td>
        </tr>
        <tr>
          <td>Group Address</td>
          <td>{{}}</td>
        </tr>
        <tr>
          <td>Saving Amount</td>
          <td>{{}}</td>
        </tr>
        <tr>
          <td>Saving Type</td>
          <td>{{}}</td>
        </tr>
        <tr>
          <td>Loan Interest</td>
          <td>{{}}</td>
        </tr>
        <tr>
          <td>Loan Type</td>
          <td>{{}}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: 'GroupSavings',
}
</script>

<style></style>
