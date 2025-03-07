import React from "react";

import { mount } from "enzyme";

import toDiffableHtml from "diffable-html";

import { AlertStore } from "Stores/AlertStore";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { ThemeContext } from "Components/Theme";
import { ReactSelectColors, ReactSelectStyles } from "Components/MultiSelect";
import { AlertManagerInput } from ".";

let alertStore;
let silenceFormStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
  alertStore.data.upstreams.clusters = {
    ha: ["am1", "am2"],
    am3: ["am3"]
  };
  alertStore.data.upstreams.instances = [
    {
      name: "am1",
      uri: "http://am1.example.com",
      publicURI: "http://am1.example.com",
      headers: {},
      error: "",
      version: "0.15.0",
      cluster: "ha",
      clusterMembers: ["am1", "am2"]
    },
    {
      name: "am2",
      uri: "http://am2.example.com",
      publicURI: "http://am2.example.com",
      headers: {},
      error: "",
      version: "0.15.0",
      cluster: "ha",
      clusterMembers: ["am1", "am2"]
    },
    {
      name: "am3",
      uri: "http://am3.example.com",
      publicURI: "http://am3.example.com",
      headers: {},
      error: "",
      version: "0.15.0",
      cluster: "am3",
      clusterMembers: ["am3"]
    }
  ];
  silenceFormStore = new SilenceFormStore();
});

const MountedAlertManagerInput = () => {
  return mount(
    <ThemeContext.Provider
      value={{
        reactSelectStyles: ReactSelectStyles(ReactSelectColors.Light)
      }}
    >
      <AlertManagerInput
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
      />
    </ThemeContext.Provider>
  );
};

const ValidateSuggestions = () => {
  const tree = MountedAlertManagerInput();
  // clear all selected instances, they are selected by default
  const clear = tree.find("ClearIndicator");
  // https://github.com/JedWatson/react-select/blob/c22d296d50917e210836fb011ae3e565895e6440/src/__tests__/Select.test.js#L1873
  clear.simulate("mousedown", { button: 0 });
  // click on the react-select component doesn't seem to trigger options
  // rendering in tests, so change the input instead
  tree.find("input").simulate("change", { target: { value: "am" } });
  return tree;
};

describe("<AlertManagerInput />", () => {
  it("matches snapshot", () => {
    const tree = MountedAlertManagerInput();
    expect(toDiffableHtml(tree.html())).toMatchSnapshot();
  });

  it("doesn't render ValidationError after passed validation", () => {
    const tree = MountedAlertManagerInput();
    silenceFormStore.data.wasValidated = true;
    expect(toDiffableHtml(tree.html())).not.toMatch(/fa-exclamation-circle/);
    expect(toDiffableHtml(tree.html())).not.toMatch(/Required/);
  });

  it("renders ValidationError after failed validation", () => {
    const tree = MountedAlertManagerInput();
    tree
      .find(".react-select__multi-value__remove")
      .at(0)
      .simulate("click");
    tree
      .find(".react-select__multi-value__remove")
      .at(0)
      .simulate("click");
    silenceFormStore.data.alertmanagers = [];
    silenceFormStore.data.wasValidated = true;
    expect(toDiffableHtml(tree.html())).toMatch(/fa-exclamation-circle/);
    expect(toDiffableHtml(tree.html())).toMatch(/Required/);
  });

  it("all available Alertmanager instances are selected by default", () => {
    MountedAlertManagerInput();
    expect(silenceFormStore.data.alertmanagers).toHaveLength(2);
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "am1 | am2",
      value: ["am1", "am2"]
    });
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "am3",
      value: ["am3"]
    });
  });

  it("doesn't override last selected Alertmanager instances on mount", () => {
    silenceFormStore.data.alertmanagers = [{ label: "am3", value: ["am3"] }];
    MountedAlertManagerInput();
    expect(silenceFormStore.data.alertmanagers).toHaveLength(1);
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "am3",
      value: ["am3"]
    });
  });

  it("renders all 3 suggestions", () => {
    const tree = ValidateSuggestions();
    const options = tree.find("div.react-select__option");
    expect(options).toHaveLength(2);
    expect(options.at(0).text()).toBe("am1 | am2");
    expect(options.at(1).text()).toBe("am3");
  });

  it("clicking on options appends them to silenceFormStore.data.alertmanagers", () => {
    silenceFormStore.data.alertmanagers = [];
    const tree = ValidateSuggestions();
    const options = tree.find("div.react-select__option");
    options.at(0).simulate("click");
    options.at(1).simulate("click");
    expect(silenceFormStore.data.alertmanagers).toHaveLength(2);
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "am1 | am2",
      value: ["am1", "am2"]
    });
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "am3",
      value: ["am3"]
    });
  });

  it("silenceFormStore.data.alertmanagers gets updated from alertStore.data.upstreams.instances on mismatch", () => {
    const tree = MountedAlertManagerInput();
    alertStore.data.upstreams.clusters = {
      amNew: ["amNew"]
    };
    // force update since this is where the mismatch check lives
    tree.instance().componentDidUpdate();
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "amNew",
      value: ["amNew"]
    });
  });

  it("is enabled when silenceFormStore.data.silenceID is null", () => {
    silenceFormStore.data.silenceID = null;
    const tree = MountedAlertManagerInput();
    const select = tree.find("StateManager");
    expect(select.props().isDisabled).toBeFalsy();
  });

  it("is disabled when silenceFormStore.data.silenceID is not null", () => {
    silenceFormStore.data.silenceID = "1234";
    const tree = MountedAlertManagerInput();
    const select = tree.find("StateManager");
    expect(select.props().isDisabled).toBe(true);
  });

  it("removing last options sets silenceFormStore.data.alertmanagers to []", () => {
    const tree = MountedAlertManagerInput();
    expect(silenceFormStore.data.alertmanagers).toHaveLength(2);

    tree
      .find(".react-select__multi-value__remove")
      .at(0)
      .simulate("click");
    expect(silenceFormStore.data.alertmanagers).toHaveLength(1);

    tree.find(".react-select__multi-value__remove").simulate("click");
    expect(silenceFormStore.data.alertmanagers).toHaveLength(0);
    expect(silenceFormStore.data.alertmanagers).toEqual([]);
  });
});
