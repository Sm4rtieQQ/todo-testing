import TodoInput from "@/components/TodoInput.vue";
import { shallowMount } from "@vue/test-utils";

describe("TodoInput", () => {
  it("should render todo-form on mount", () => {
    // Arrange
    const wrapper = shallowMount(TodoInput);

    // Act
    // Assert
    expect(wrapper.getByDataTest("todo-form").exists()).toBe(true);
    expect(wrapper.getByDataTest("todo-input").exists()).toBe(true);
    expect(wrapper.getByDataTest("add-button").exists()).toBe(true);
  });

  it("should emit add-todo whit newTodo value on submit", async () => {
    // Arrange
    const wrapper = shallowMount(TodoInput);
    const newTodo = "Een nieuwe taak";

    // Act
    await wrapper.getByDataTest("todo-input").setValue(newTodo);
    await wrapper.getByDataTest("todo-form").trigger("submit");

    // Assert
    expect(wrapper.emitted("add-todo")).toHaveLength(1);
    expect(wrapper.emitted("add-todo")?.[0]?.[0]).toStrictEqual(
      "Een nieuwe taak",
    );
  });

  it("should trim whitespaces on submit", async () => {
    // Arrange
    const wrapper = shallowMount(TodoInput);
    const newTodo = "          Een nieuwe taak         ";

    // Act
    await wrapper.getByDataTest("todo-input").setValue(newTodo);
    await wrapper.getByDataTest("todo-form").trigger("submit");

    // Assert
    expect(wrapper.emitted("add-todo")?.[0]?.[0]).toStrictEqual(
      "Een nieuwe taak",
    );
  });

  it("should clear todo-input value on submit", async () => {
    // Arrange
    const wrapper = shallowMount(TodoInput);
    const newTodo = "Een nieuwe taak";

    // Act
    await wrapper.getByDataTest("todo-input").setValue(newTodo);
    await wrapper.getByDataTest("todo-form").trigger("submit");

    // Assert
    expect(
      (wrapper.getByDataTest("todo-input").element as HTMLInputElement).value,
    ).toStrictEqual("");
  });

  it("should not emit when todo-input is empty or only contains whitespaces", async () => {
    // Arrange
    const wrapper = shallowMount(TodoInput);
    const emptyTodo = "";
    const whitespaceTodo = "              ";

    // Act & Assert
    await wrapper.getByDataTest("todo-input").setValue(emptyTodo);
    await wrapper.getByDataTest("todo-form").trigger("submit");
    expect(wrapper.emitted("add-todo")).toBeUndefined();

    await wrapper.getByDataTest("todo-input").setValue(whitespaceTodo);
    await wrapper.getByDataTest("todo-form").trigger("submit");
    expect(wrapper.emitted("add-todo")).toBeUndefined();
  });

  it("should have an enabled button on valid input", async () => {
    // Arrange
    const wrapper = shallowMount(TodoInput);
    const newTodo = "Een nieuwe taak";

    // Act & Assert
    await wrapper.getByDataTest("todo-input").setValue(newTodo);
    expect(
      (wrapper.getByDataTest("add-button").element as HTMLInputElement)
        .disabled,
    ).toBe(false);
  });

  it("should have a disabled button on empty/whitespace only input", async () => {
    // Arrange
    const wrapper = shallowMount(TodoInput);
    const emptyTodo = "";
    const whitespaceTodo = "              ";

    // Act & Assert
    await wrapper.getByDataTest("todo-input").setValue(emptyTodo);
    expect(
      (wrapper.getByDataTest("add-button").element as HTMLInputElement)
        .disabled,
    ).toBe(true);

    await wrapper.getByDataTest("todo-input").setValue(whitespaceTodo);
    expect(
      (wrapper.getByDataTest("add-button").element as HTMLInputElement)
        .disabled,
    ).toBe(true);
  });
});
