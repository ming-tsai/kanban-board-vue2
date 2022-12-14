<template>
  <div>
    <br />
    <div class="row" v-drag-and-drop="options">
      <q-list
        v-for="group in data"
        :key="group.status"
        :data-id="group.status"
        class="app-custom-list col-3"
        dense
        bordered
        padding
        @added="added($event, group)"
        @removed="removed($event, group)"
        @reordered="reordered($event, group)"
      >
        <q-item-section>
          <q-item-label>{{ group.status }}</q-item-label>
        </q-item-section>
        <br />
        <q-item-section
          v-if="group.status == 'To Do'"
          style="padding: 2px 16px"
        >
          <q-btn color="secondary" icon="add" label="Add" @click="onAdd" />
        </q-item-section>
        <br />
        <q-item
          v-for="item in group.items"
          :key="item.id"
          :data-id="item.id"
          class="app-custom-item"
        >
          <task-card
            :task="item"
            :status="group.status"
            loading
            @edit="onEdit"
          />
        </q-item>
      </q-list>
    </div>
    <div>
      <q-dialog v-model="adding" persistent>
        <q-card style="width: 700px; max-width: 80vw">
          <q-card-section>
            <div class="text-h6">
              {{ form.isUpdate ? "Edit a" : "Create a new" }} task
            </div>
          </q-card-section>
          <q-form
            @submit="onSubmit"
            @reset="adding = false"
            class="q-gutter-md q-pa-md"
          >
            <q-input
              filled
              v-model="form.title"
              label="Title *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please type title']"
            />
            <div class="row">
              <div class="col-5">
                <div>
                  <q-select
                    filled
                    v-model="form.status"
                    :options="statusOptions"
                    label="Status"
                    :readonly="!form.isUpdate"
                  />
                </div>
              </div>
              <q-space />
              <div class="col-5">
                <q-select
                  label="Tags"
                  filled
                  v-model="form.tags"
                  use-input
                  use-chips
                  multiple
                  hide-dropdown-icon
                  input-debounce="0"
                  new-value-mode="toggle"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-5">
                <div>
                  <q-input filled v-model="form.assignee" label="Assignee" />
                </div>
              </div>
              <q-space />
              <div class="col-5">
                <q-input
                  filled
                  v-model="form.dueDate"
                  hit="Due date"
                  type="date"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" />
                  </template>
                </q-input>
              </div>
            </div>
            <q-input
              filled
              type="textarea"
              v-model="form.description"
              label="Description"
            />

            <q-card-actions align="right">
              <q-btn
                label="Cancel"
                type="reset"
                color="black"
                flat
                class="q-ml-sm"
                @click="adding = false"
              />
              <q-btn label="Submit" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
      <q-dialog v-model="confirm" v-if="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar round icon="edit" color="secondary" text-color="white" />
            <span class="q-ml-sm"
              >Are you sure that you want to
              {{ form.isUpdate ? "edit" : "create" }} the task?</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="black" @click="confirm = false" />
            <q-btn
              flat
              :label="form.isUpdate ? 'edit' : 'add'"
              color="secondary"
              @click="confirmUpdate"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { QList, QItem, QItemLabel, QItemSection, QBtn, QDialog } from "quasar";
import { QCard, QCardSection, QForm, QInput, QCardActions } from "quasar";
import { QSelect, QSpace, QIcon, QAvatar } from "quasar";
import { mapState, mapActions } from "vuex";
import TaskCard from "../components/TaskCard.vue";

export default {
  name: "AppHome",
  components: {
    QList,
    QItem,
    QItemLabel,
    QItemSection,
    TaskCard,
    QBtn,
    QDialog,
    QCard,
    QForm,
    QCardSection,
    QInput,
    QCardActions,
    QSelect,
    QSpace,
    QIcon,
    QAvatar,
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      adding: false,
      confirm: false,
      data: [
        {
          status: "To Do",
        },
        {
          status: "In Progress",
        },
        {
          status: "Done",
        },
      ],
      statusOptions: ["To Do", "In Progress", "Done"],
      isLoading: false,
      form: {
        id: 0,
        title: "",
        description: "",
        assignee: "",
        dueDate: "",
        status: "To Do",
        tags: [],
        isUpdate: false,
      },
      options: {
        multipleDropzonesItemsDraggingEnabled: false,
        dropzoneSelector: ".q-list",
        draggableSelector: ".q-item",
      },
    };
  },
  methods: {
    ...mapActions(["add", "remove", "edit", "update"]),
    getData() {
      this.data = this.tasks;
    },
    added(event, group) {
      const newItems = this.data
        .map((group) => group.items)
        .reduce((prev, curr) => [...prev, ...curr], [])
        .filter((item) => event.detail.ids.map(Number).indexOf(item.id) >= 0);
      group.items.splice(event.detail.index, 0, ...newItems);
      this.update(this.data);
    },
    removed(event, group) {
      group.items = group.items.filter(
        (item) => event.detail.ids.map(Number).indexOf(item.id) < 0
      );
      this.update(this.data);
    },
    reordered(event, group) {
      const reorderedItems = group.items.filter(
        (item) => event.detail.ids.map(Number).indexOf(item.id) >= 0
      );
      const newItems = group.items.filter(
        (item) => event.detail.ids.map(Number).indexOf(item.id) < 0
      );
      newItems.splice(event.detail.index, 0, ...reorderedItems);
      group.items = newItems;
      this.update(this.data);
    },
    onAdd() {
      this.clearForm();
      this.adding = true;
    },
    onSubmit() {
      this.confirm = true;
    },
    confirmUpdate() {
      this.confirm = false;
      this.adding = false;
      if (this.form.isUpdate) {
        this.edit(this.form);
      } else {
        this.add(this.form);
      }
      this.clearForm();
      this.$q.notify({
        color: "green-4",
        textColor: "white",
        icon: "done",
        message: "Submitted",
      });
    },
    clearForm() {
      this.form = {
        id: 0,
        title: "",
        description: "",
        status: "To Do",
        assignee: "",
        dueDate: "",
        tags: [],
        isUpdate: false,
      };
    },
    onEdit(task) {
      this.form = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        assignee: task.assignee,
        dueDate: task.dueDate,
        tags: task.tags,
        isUpdate: true,
      };
      this.adding = true;
    },
  },
  computed: {
    ...mapState(["tasks"]),
  },
  watch: {
    tasks(val) {
      this.data = val;
    },
  },
};
</script>

<style>
.app-custom-list {
  min-width: 10rem;
  height: 90vh;
  margin-top: 0 !important;
  min-height: 90vh;
}
.app-custom-item {
  padding: 0.5rem;
}

.app-card {
  width: 100%;
}

.app-custom-item[aria-grabbed="true"] .app-card .q-card {
  border-color: rgb(75, 75, 210);
}

button.app-btn:hover {
  background-color: none !important;
}

@keyframes nodeInserted {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 0.8;
  }
}

.item-dropzone-area {
  height: 2rem;
  background: #888;
  opacity: 0.8;
  animation-duration: 0.5s;
  animation-name: nodeInserted;
  margin-left: 0.6rem;
  margin-right: 0.6rem;
}

div.row div.q-list {
  padding: 1rem;
  margin: 1rem;
}
</style>
