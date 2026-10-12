import TodoItem from "@/components/TodoItem.vue";
import { shallowMount } from "@vue/test-utils";

describe("TodoItem", () => {
  it("should render the todo text correctly", () => {
    // Arrange
    const todo = {
      id: 12,
      text: "De twaalfde taak",
      completed: false,
    };
    const wrapper = shallowMount(TodoItem, { props: { todo } });

    // Act
    // Assert
    expect(wrapper.getByDataTest("todo-text").text()).toBe("De twaalfde taak");
  });

  it("should not check checkbox and not linetrough text when completed is false", () => {
    // Arrange
    const todo = {
      id: 12,
      text: "De twaalfde taak",
      completed: false,
    };
    const wrapper = shallowMount(TodoItem, { props: { todo } });

    // Act
    // Assert
    expect(
      (wrapper.getByDataTest("todo-checkbox").element as HTMLInputElement)
        .checked,
    ).toBe(false);
    expect(wrapper.find(".completed").exists()).toBe(false);
  });

  it("should check checkbox and linethrough text when completed is true", () => {
    // Arrange
    const todo = {
      id: 12,
      text: "De twaalfde taak",
      completed: true,
    };
    const wrapper = shallowMount(TodoItem, { props: { todo } });

    // Act
    // Assert
    expect(
      (wrapper.getByDataTest("todo-checkbox").element as HTMLInputElement)
        .checked,
    ).toBe(true);
    expect(wrapper.find(".completed").exists()).toBe(true);
  });

  it("should emit toggle event when checkbox is clicked", async () => {
    // Arrange
    const todo = {
      id: 12,
      text: "De twaalfde taak",
      completed: false,
    };
    const wrapper = shallowMount(TodoItem, { props: { todo } });

    // Act
    await wrapper.getByDataTest("todo-checkbox").setValue(true);

    // Assert
    expect(wrapper.emitted("toggle")).toHaveLength(1);
    expect(wrapper.emitted("toggle")?.[0]?.[0]).toStrictEqual(12);
  });

  it("should emit delete event when delete-button is clicked", async () => {
    // Arrange
    const todo = {
      id: 12,
      text: "De twaalfde taak",
      completed: false,
    };
    const wrapper = shallowMount(TodoItem, { props: { todo } });

    // Act
    await wrapper.getByDataTest("delete-button").trigger("click");

    // Assert
    expect(wrapper.emitted("delete")).toHaveLength(1);
    expect(wrapper.emitted("delete")?.[0]?.[0]).toStrictEqual(12);
  });
});
