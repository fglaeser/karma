import React from "react";

import { mount, render } from "enzyme";

import { AlertStore, NewUnappliedFilter } from "Stores/AlertStore";

import { FilteringCounterBadge } from ".";

let alertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
});

const validateClassName = (value, className, themed) => {
  const tree = mount(
    <FilteringCounterBadge
      alertStore={alertStore}
      name="@state"
      value={value}
      counter={1}
      themed={themed}
    />
  );
  expect(tree.find("span").hasClass(className)).toBe(true);
};

const validateStyle = (value, themed) => {
  const tree = mount(
    <FilteringCounterBadge
      alertStore={alertStore}
      name="@state"
      value={value}
      counter={1}
      themed={themed}
    />
  );
  // opacity=>1 is set by react-reveal/Flash
  expect(tree.find("span").prop("style")).toEqual({ opacity: 1 });
};

const validateOnClick = (value, themed) => {
  const tree = mount(
    <FilteringCounterBadge
      alertStore={alertStore}
      name="@state"
      value={value}
      counter={1}
      themed={themed}
    />
  );
  tree.find(".components-label").simulate("click");
  expect(alertStore.filters.values).toHaveLength(1);
  expect(alertStore.filters.values).toContainEqual(
    NewUnappliedFilter(`@state=${value}`)
  );
};

describe("<FilteringCounterBadge />", () => {
  it("themed @state=unprocessed counter badge should have className 'badge-secondary'", () => {
    validateClassName("unprocessed", "badge-secondary", true);
  });
  it("themed @state=active counter badge should have className 'badge-secondary'", () => {
    validateClassName("active", "badge-danger", true);
  });
  it("themed @state=suppressed counter badge should have className 'badge-secondary'", () => {
    validateClassName("suppressed", "badge-success", true);
  });
  it("unthemed @state=suppressed counter badge should have className 'badge-primary'", () => {
    validateClassName("suppressed", "badge-primary", false);
  });

  it("@state=unprocessed counter badge should have empty style", () => {
    validateStyle("unprocessed", true);
  });
  it("@state=active counter badge should have empty style", () => {
    validateStyle("active", true);
  });
  it("@state=suppressed counter badge should have empty style", () => {
    validateStyle("suppressed", true);
  });

  it("counter badge should have correct children based on the counter prop value", () => {
    const tree = render(
      <FilteringCounterBadge
        alertStore={alertStore}
        name="@state"
        value="active"
        counter={123}
        themed={true}
      />
    );
    expect(tree.text()).toBe("123");
  });

  it("onClick method on @state=unprocessed counter badge should add a new filter", () => {
    validateOnClick("unprocessed", true);
  });
  it("onClick method on @state=active counter badge should add a new filter", () => {
    validateOnClick("active", true);
  });
  it("onClick method on @state=suppressed counter badge should add a new filter", () => {
    validateOnClick("suppressed", true);
  });
});
