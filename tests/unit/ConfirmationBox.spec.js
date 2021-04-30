import { shallowMount } from "@vue/test-utils";
import ConfirmationBox from "@/components/ConfirmationBox.vue";

describe("Confirmation Box Test", () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallowMount(ConfirmationBox, {
      propsData: {
        uniqueKey: "test",
      },
    });
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("initializes with the correct elements on screen", () => {
    let deleteButton = wrapper.find("button");
    expect(deleteButton.isVisible()).toBe(true);
    expect(deleteButton.text()).toMatch("");

    expect(deleteButton.attributes("data-target")).toBe("delete-modal-test");

    let deleteModal = wrapper.find(".modal");
    expect(deleteModal.attributes("id")).toBe("delete-modal-test");
  });

  it("emits an event when yes confirmation is clicked in modal", () => {
    wrapper.find(".delete-yes").trigger("click");

    expect(wrapper.emitted("deleteDocument")).toBeTruthy();
    expect(wrapper.emitted("deleteDocument").length).toBe(1);
  });
});
