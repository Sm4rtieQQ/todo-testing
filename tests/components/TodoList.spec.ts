import TodoInput from "@/components/TodoInput.vue";
import TodoItem from "@/components/TodoItem.vue";
import TodoList from "@/components/TodoList.vue";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("TodoList", () => {
  it("should show empty state when todos is empty", () => {
    // Arrange
    const wrapper = shallowMount(TodoList);

    // Act
    // Assert: confirm if ONLY the empty-state exists
    expect(wrapper.getByDataTest("empty-state").exists()).toBe(true);
    expect(wrapper.getByDataTest("filters").exists()).toBe(false);
    expect(wrapper.getByDataTest("todo-list").exists()).toBe(false);
    expect(wrapper.getByDataTest("no-results").exists()).toBe(false);
  });

  it("should add and view a todo when emitted from child", async () => {
    // Arrange
    const wrapper = shallowMount(TodoList);

    // Act: add 2 todos to list
    wrapper.findComponent(TodoInput).vm.$emit("add-todo", "Maak een lijst");
    wrapper.findComponent(TodoInput).vm.$emit("add-todo", "Vink een taak af");
    await flushPromises();
    const items = wrapper.findAllComponents(TodoItem);

    // Assert: confirm if todos are visible and contain correct data
    expect(wrapper.getByDataTest("empty-state").exists()).toBe(false);
    expect(wrapper.getByDataTest("filters").exists()).toBe(true);
    expect(wrapper.getByDataTest("todo-list").exists()).toBe(true);
    expect(wrapper.getByDataTest("no-results").exists()).toBe(false);

    expect(items).toHaveLength(2);
    expect(items[0].props("todo")).toStrictEqual({
      id: 1,
      text: "Maak een lijst",
      completed: false,
    });
    expect(items[1].props("todo")).toStrictEqual({
      id: 2,
      text: "Vink een taak af",
      completed: false,
    });
  });

  it("should delete todo when delete-event is emitted from child", async () => {
    // Arrange
    const wrapper = shallowMount(TodoList);

    // Act: add 2 todos to list and delete the first
    wrapper.findComponent(TodoInput).vm.$emit("add-todo", "Maak een lijst");
    wrapper.findComponent(TodoInput).vm.$emit("add-todo", "Vink een taak af");
    await flushPromises();

    wrapper.findAllComponents(TodoItem)[0].vm.$emit("delete", 1);
    await flushPromises();

    // Assert: confirm if only first todo was sucessfully deleted
    expect(wrapper.findAllComponents(TodoItem)).toHaveLength(1);
    expect(wrapper.findAllComponents(TodoItem)[0].props("todo")).toStrictEqual({
      id: 2,
      text: "Vink een taak af",
      completed: false,
    });
  });

  it("should toggle completed when toggle-event emitted from child", async () => {
    // Arrange
    const wrapper = shallowMount(TodoList);

    // Act: add 2 todos to list and toggle the first
    wrapper.findComponent(TodoInput).vm.$emit("add-todo", "Maak een lijst");
    wrapper.findComponent(TodoInput).vm.$emit("add-todo", "Vink een taak af");
    await flushPromises();

    wrapper.findAllComponents(TodoItem)[0].vm.$emit("toggle", 1);
    await flushPromises();

    // Assert: confirm if only first item was toggled
    expect(
      wrapper.findAllComponents(TodoItem)[0].props("todo").completed,
    ).toStrictEqual(true);
    expect(
      wrapper.findAllComponents(TodoItem)[1].props("todo").completed,
    ).toStrictEqual(false);
  });

  it("should toggle completed back to false when emitted on a true item from child", async () => {
    // Arrange
    const wrapper = shallowMount(TodoList);

    // Act & Assert: add todo itm to list and toggle and check it twice
    wrapper.findComponent(TodoInput).vm.$emit("add-todo", "Maak een lijst");
    await flushPromises();

    wrapper.findAllComponents(TodoItem)[0].vm.$emit("toggle", 1);
    await flushPromises();

    expect(
      wrapper.findAllComponents(TodoItem)[0].props("todo").completed,
    ).toStrictEqual(true);

    wrapper.findAllComponents(TodoItem)[0].vm.$emit("toggle", 1);
    await flushPromises();

    expect(
      wrapper.findAllComponents(TodoItem)[0].props("todo").completed,
    ).toStrictEqual(false);
  });

  it("should toggle nothing if toggle id does not match with an item", async () => {
    // Arrange
    const wrapper = shallowMount(TodoList);

    // Act: add todo item to list and try to toggle non-existing item id
    wrapper.findComponent(TodoInput).vm.$emit("add-todo", "Maak een lijst");
    await flushPromises();

    wrapper.findComponent(TodoItem).vm.$emit("toggle", 4);
    await flushPromises();

    // Assert: confirm if checked is still 'false'
    expect(
      wrapper.findComponent(TodoItem).props("todo").completed,
    ).toStrictEqual(false);
  });
});
