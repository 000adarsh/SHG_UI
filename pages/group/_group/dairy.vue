<template>
  <div>
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
    <v-row class="pt-3">
      <v-spacer></v-spacer
      ><v-col cols="12" sm="4" lg="4">
        <v-dialog
          ref="dialog"
          v-model="picker"
          :return-value.sync="date"
          persistent
          width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Select Month"
              prepend-icon="mdi-calendar"
              readonly
              dense
              outlined
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            type="month"
            color="success"
            header-color="error"
            scrollable
            @change="change"
          >
            <v-spacer></v-spacer>
            <v-btn text outlined color="primary" @click="picker = false">
              Cancel
            </v-btn>
            <v-btn
              text
              outlined
              color="primary"
              @click="$refs.dialog.save(date) & getDiaryNotes()"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col></v-row
    >
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
      createNoteDialog: false,
      loading: false,
      deleteLoading: false,
      clicked: '',
      notes: [],
      picker: false,
      date: this.$moment(Date.now()).format('YYYY-MM'),
      startDate: null,
      endDate: null,
    }
  },

  async created() {
    await this.change(this.date)
    await this.getDiaryNotes()
  },
  methods: {
    async change(x) {
      const startDate = await this.$moment(x).startOf('month').toDate()
      const endDate = await this.$moment(x).endOf('month').toDate()
      this.startDate = startDate
      this.endDate = endDate
    },
    async getDiaryNotes() {
      const notes = await FetchService.getDiaryNotes({
        groupId: this.$route.params.group,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      if (notes) {
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
