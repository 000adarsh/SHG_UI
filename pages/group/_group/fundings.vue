<template>
  <div>
    <div>
      <h1 class="text-center">
        {{ $route.query.name.toUpperCase() }}
      </h1>
    </div>
    <v-card-actions
      ><v-btn text outlined color="primary" @click="createFundingDialog = true"
        >create a Funding</v-btn
      ></v-card-actions
    >
    <div>
      <v-dialog
        v-if="createFundingDialog"
        :value="createFundingDialog"
        persistent
        max-width="900px"
        ><CreateFundingForm
          :loading="loading"
          @closeDialog="
            () => {
              createFundingDialog = false
            }
          "
          @submit="createFunding"
        />
      </v-dialog>
    </div>
    <div>
      <h3 class="text-center">Group Fundings</h3>
      <v-divider></v-divider>
      <div v-if="fundings.length">
        <v-simple-table
          ><thead>
            <tr>
              <th>Date</th>
              <th>Donator</th>
              <th>Amount</th>
              <th>Creater</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(funding, i) in fundings" :key="i">
              <td class="px-1">
                {{ $moment(funding.createDate).format('DD MMM YYYY') }}
              </td>
              <td>
                {{ funding.donator }}
              </td>
              <td>
                {{ funding.amount }}
              </td>
              <td class="text-capitalize">{{ funding.createdBy.name }}</td>
              <td>
                <v-btn
                  icon
                  outlined
                  color="error"
                  :loading="deleteLoading && clicked === i"
                  @click="deleteFunding(funding.id, i)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </td>
            </tr>
          </tbody></v-simple-table
        ><v-divider></v-divider>
      </div>
    </div>
  </div>
</template>

<script>
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'GroupFundings',
  middleware: authRouter,
  data() {
    return {
      createFundingDialog: false,
      loading: false,
      deleteLoading: false,
      clicked: '',
      fundings: [],
    }
  },

  async created() {
    await this.getFundings()
  },
  methods: {
    async getFundings() {
      const fundings = await FetchService.getFundings({
        groupId: this.$route.params.group,
      })
      if (fundings) {
        this.$root.$emit('showNotification', fundings)
      }
      if (fundings.data.status === 'success') {
        this.fundings = fundings.data.fundings
      }
    },
    async createFunding(payload) {
      this.loading = true
      const funding = await FetchService.createFunding({
        groupId: this.$route.params.group,
        ...payload,
      })
      if (funding) {
        this.$root.$emit('showNotification', funding)
      }
      if (funding.data.status === 'success') {
        await this.getFundings()
        this.loading = false
        this.createFundingDialog = false
      }
      this.loading = false
    },
    async deleteFunding(id, i) {
      this.clicked = i
      this.deleteLoading = true
      const funding = await FetchService.deleteFunding({
        groupId: this.$route.params.group,
        fundingId: id,
      })
      if (funding) {
        this.$root.$emit('showNotification', funding)
      }
      if (funding.data.status === 'success') {
        await this.getFundings()
        this.deleteLoading = false
      }
      this.deleteLoading = false
    },
  },
}
</script>

<style></style>
