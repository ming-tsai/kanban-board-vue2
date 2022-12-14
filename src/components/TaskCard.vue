<template>
  <div class="app-card">
    <q-card flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <q-item-label class="text-h5 q-mt-sm q-mb-xs">{{
            task.title
          }}</q-item-label>
          <br />
          <q-chip v-if="task.assignee">
            <q-avatar color="red" text-color="white" size="25px">{{
              getLetter(task.assignee)
            }}</q-avatar>
            {{ task.assignee }}
          </q-chip>
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <label class="float-label"> {{ task.dueDate }} </label>
        <q-space />
        <q-btn outline round color="primary" icon="edit" @click="onEdit" />
        <q-btn
          outline
          round
          color="negative"
          icon="delete_forever"
          @click="openPopup"
        />
      </q-card-actions>
    </q-card>
    <q-dialog v-model="confirm" v-if="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            round
            icon="delete_forever"
            color="negative"
            text-color="white"
          />
          <span class="q-ml-sm"
            >Are you sure that you want to delete forever the task?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="black" @click="closePopup" />
          <q-btn flat label="Delete" color="negative" @click="confirmRemove" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { QCardSection, QAvatar, QCard, QItemLabel, QDialog } from "quasar";
import { QBtn, QSeparator, QCardActions, QSpace, QChip } from "quasar";
import { mapActions } from "vuex";

export default {
  name: "TaskCard",
  props: {
    task: {
      type: Object,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
    loading: {
      type: Boolean,
      require: false,
    },
  },
  components: {
    QCardSection,
    QAvatar,
    QCard,
    QBtn,
    QSeparator,
    QCardActions,
    QSpace,
    QItemLabel,
    QChip,
    QDialog,
  },
  mounted() {},
  data() {
    return {
      confirm: false,
    };
  },
  methods: {
    ...mapActions(["remove"]),
    getLetter(name) {
      return name[0];
    },
    openPopup() {
      this.confirm = true;
    },
    closePopup() {
      this.confirm = false;
    },
    confirmRemove() {
      this.closePopup();
      this.removeTask();
    },
    removeTask() {
      const task = {
        status: this.status,
        id: this.task.id,
      };
      this.$emit("remove", task);
      this.remove(task);
    },
    onEdit() {
      const task = this.task;
      task["status"] = this.status;
      this.$emit("edit", task);
    },
  },
  computed: {},
  watch: {},
};
</script>

<style>
.app-card {
  width: 100%;
}
</style>
