import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default new Vuex.Store({
  state: {
    count: 7,
    tasks: [
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
    ],
  },
  getters: {
    getTasks(state) {
      return state.tasks;
    },
    getId(state) {
      return state.count;
    },
  },
  mutations: {
    updateTasks(state, tasks) {
      state.tasks = tasks;
    },
    addTask(state, task) {
      const index = state.tasks.findIndex((o) => o.status == task.status);
      const found = state.tasks[index];
      task.id = state.count;
      found.items = [task].concat(found.items);
      state.count++;
    },
    removeTask(state, task) {
      const index = state.tasks.findIndex((o) => o.status == task.status);
      const found = state.tasks[index];
      found.items = found.items.filter((item) => item.id != task.id);
    },
    editTask(state, task) {
      const index = state.tasks.findIndex((o) => o.status == task.status);
      const found = state.tasks[index];
      found.items = found.items.map((i) => {
        if (i.id == task.id) {
          i = task;
        }
        return i;
      });
    },
  },
  actions: {
    update({ commit }, tasks) {
      commit("updateTasks", tasks);
    },
    add({ commit }, task) {
      commit("addTask", task);
    },
    remove({ commit }, task) {
      commit("removeTask", task);
    },
    edit({ commit }, task) {
      commit("editTask", task);
    },
  },
  plugins: [vuexLocal.plugin],
  modules: {},
});
