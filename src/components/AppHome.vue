<template>
  <div>
    <div class="row">{{ workItems }}</div>
    <div class="row" v-drag-and-drop="options">
      <q-list
        v-for="group in workItems"
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
        <q-item
          v-for="item in group.items"
          :key="item.id"
          :data-id="item.id"
          class="app-custom-item"
        >
          <q-card class="app-card" flat bordered>
            <q-card-section horizontal>
              <q-card-section class="q-pt-xs col">
                <div class="text-h6 q-mt-sm q-mb-xs row">
                  <div class="col">{{ item.title }}</div>
                  <q-btn class="col-1" round flat icon="more_vert">
                    <q-menu cover auto-close class="app-btn">
                      <q-list>
                        <q-item clickable>
                          <q-item-section>Remove Card</q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>Send Feedback</q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>Share</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
                <q-avatar color="red" text-color="white" size="25px">{{
                  getLetter(item.assignee)
                }}</q-avatar>
                <div class="text-caption text-grey">{{ item.dueDate }}</div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { QList, QItem, QCardSection, QItemLabel, QAvatar, QCard } from "quasar";
import { QBtn, QMenu, QItemSection } from "quasar";

export default {
  name: "AppHome",
  components: {
    QList,
    QItem,
    QCardSection,
    QItemLabel,
    QAvatar,
    QCard,
    QBtn,
    QMenu,
    QItemSection,
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      workItems: [
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
      options: {
        multipleDropzonesItemsDraggingEnabled: false,
        dropzoneSelector: ".q-list",
        draggableSelector: ".q-item",
      },
    };
  },
  methods: {
    getData() {
      // setTimeout(() => {
      this.workItems = [
        {
          status: "To Do",
          items: [
            {
              id: 1,
              title: "Add discount code to checkout page",
              description: "",
              assignee: "Test User",
              dueDate: "2022-12-30",
              tags: ["tag 1"],
            },
            {
              id: 2,
              title: "Item 2",
              description: "",
              assignee: "Juan",
              dueDate: "2022-12-31",
              tags: ["tag 2"],
            },
          ],
        },
        {
          status: "In Progress",
          items: [
            {
              id: 3,
              title: "Item 3",
              description: "",
              assignee: "Antonio",
              dueDate: "2022-12-15",
              tags: ["tag 3"],
            },
            {
              id: 4,
              title: "Item 4",
              description: "",
              assignee: "Ming",
              dueDate: "2022-12-15",
              tags: ["tag 4"],
            },
          ],
        },
        {
          status: "Done",
          items: [
            {
              id: 5,
              title: "Item 5",
              description: "",
              assignee: "Juan",
              dueDate: "2022-12-01",
              tags: ["tag 5"],
            },
            {
              id: 6,
              title: "Item 6",
              description: "",
              assignee: "Pedro",
              dueDate: "2022-12-01",
              tags: ["tag 6"],
            },
          ],
        },
      ];
      // }, 5000);
    },
    getLetter(name) {
      console.log(name);
      return name[0];
    },
    added(event, group) {
      const newItems = this.workItems
        .map((group) => group.items)
        .reduce((prev, curr) => [...prev, ...curr], [])
        .filter((item) => event.detail.ids.map(Number).indexOf(item.id) >= 0);
      group.items.splice(event.detail.index, 0, ...newItems);
    },
    removed(event, group) {
      group.items = group.items.filter(
        (item) => event.detail.ids.map(Number).indexOf(item.id) < 0
      );
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
    },
  },
};
</script>

<style>
.app-custom-list {
  min-width: 10rem;
  height: 80vh;
  margin-top: 0 !important;
  min-height: 80vh;
}
.app-custom-item {
  padding: 0.5rem;
}

.app-card {
  width: 100%;
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
