<template>
  <div>
    <div>
      <v-overlay :value="pageLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </div>
    <v-card-actions
      ><v-btn text outlined color="primary" @click="createNoteDialog = true"
        >create a note</v-btn
      ></v-card-actions
    >
    <div>
      <h1 class="text-center">
        {{ $route.query.name.toUpperCase() }}
      </h1>
    </div>
    <div>
      <v-dialog
        v-if="createNoteDialog"
        :value="createNoteDialog"
        persistent
        max-width="900px"
        ><create-note-form
          :loading="loading"
          @closeDialog="
            () => {
              createNoteDialog = false
            }
          "
          @submit="createNote"
        />
      </v-dialog>
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
    <div>
      <h3 class="text-center">Group Dairy Notes</h3>
      <v-divider></v-divider>
      <div v-if="notes.length">
        <v-simple-table dense
          ><thead>
            <tr>
              <th>Thing</th>
              <th>Cost</th>
              <th>Purchase Place</th>
              <th>Date</th>
              <th>Creater</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(note, i) in notes" :key="i">
              <td class="text-capitalize pr-1">{{ note.productName }}</td>
              <td>{{ note.productCost }}</td>
              <td class="text-capitalize">{{ note.purchasePlace }}</td>
              <td class="px-1">
                {{ $moment(note.createDate).format('DD MMM YYYY') }}
              </td>
              <td class="text-capitalize">{{ note.createdBy.name }}</td>
              <td>
                <v-btn
                  icon
                  outlined
                  color="error"
                  :loading="deleteLoading && clicked === i"
                  @click="deleteNote(note.id, i)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </td>
            </tr>
          </tbody></v-simple-table
        >
      </div>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import createNoteForm from '~/components/createNoteForm.vue'
import authRouter from '~/middleware/authRouter'
import FetchService from '~/services/FetchService'
export default {
  name: 'GroupDiary',
  components: { createNoteForm },
  middleware: authRouter,
  data() {
    return {
      pageLoading: false,
      createNoteDialog: false,
      loading: false,
      deleteLoading: false,
      clicked: '',
      notes: [],
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
      this.getDiaryNotes()
    },
    async getDiaryNotes() {
      this.pageLoading = true
      const notes = await FetchService.getDiaryNotes({
        groupId: this.$route.params.group,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      if (notes) {
        this.pageLoading = false
        this.$root.$emit('showNotification', notes)
      }
      if (notes.data.status === 'success') {
        this.notes = notes.data.notes
      }
    },
    async createNote(payload) {
      this.loading = true
      const note = await FetchService.createDiaryNote({
        groupId: this.$route.params.group,
        ...payload,
      })
      if (note) {
        this.$root.$emit('showNotification', note)
      }
      if (note.data.status === 'success') {
        await this.getDiaryNotes()
        this.loading = false
        this.createNoteDialog = false
      }
      this.loading = false
    },
    async deleteNote(id, i) {
      this.clicked = i
      this.deleteLoading = true
      const note = await FetchService.deleteDiaryNote({
        groupId: this.$route.params.group,
        noteId: id,
      })
      if (note) {
        this.$root.$emit('showNotification', note)
      }
      if (note.data.status === 'success') {
        await this.getDiaryNotes()
        this.deleteLoading = false
      }
      this.deleteLoading = false
    },
  },
}
</script>

<style></style>
