import React from "react";

import Creatable from "react-select/creatable";

import { ThemeContext } from "Components/Theme";

const ReactSelectColors = {
  Light: {
    color: "#fff",
    singleValueColor: "#000",
    backgroundColor: "#fff",
    borderColor: "#ced4da",
    focusedBoxShadow: "rgba(69, 90, 100, 0.25)",
    focusedBorderColor: "#819ba8",
    menuBackground: "#fff",
    optionHoverBackground: "#455a64",
    valueContainerBackground: "#fff",
    disabledValueContainerBackground: "#fff"
  },
  Dark: {
    color: "#fff",
    singleValueColor: "#fff",
    backgroundColor: "#fff",
    borderColor: "#444",
    focusedBoxShadow: "rgba(69, 90, 100, 0.25)",
    focusedBorderColor: "#819ba8",
    menuBackground: "#222",
    optionHoverBackground: "#455a64",
    valueContainerBackground: "#444",
    disabledValueContainerBackground: "#fff"
  }
};

const ReactSelectStyles = theme => ({
  control: (base, state) =>
    state.isFocused
      ? {
          ...base,
          backgroundColor: theme.backgroundColor,
          outline: "0",
          outlineOffset: "-2px",
          boxShadow: `0 0 0 0.2rem ${theme.focusedBoxShadow}`,
          borderRadius: "0.25rem",
          borderColor: theme.focusedBorderColor,
          "&:hover": {
            borderColor: theme.focusedBorderColor
          }
        }
      : {
          ...base,
          backgroundColor: "inherit",
          borderRadius: "0.25rem",
          borderColor: theme.borderColor,
          "&:hover": { borderColor: theme.borderColor }
        },
  valueContainer: (base, state) =>
    state.isMulti
      ? {
          ...base,
          borderRadius: 0,
          backgroundColor: state.isDisabled
            ? theme.disabledValueContainerBackground
            : theme.valueContainerBackground,
          paddingLeft: "4px",
          paddingRight: "4px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          maxWidth: "100%",
          overflow: "hidden"
        }
      : {
          ...base,
          borderRadius: 0,
          backgroundColor: state.isDisabled
            ? theme.disabledValueContainerBackground
            : theme.valueContainerBackground
        },
  singleValue: (base, state) => ({
    ...base,
    color: theme.singleValueColor
  }),
  multiValue: (base, state) => ({
    ...base,
    borderRadius: "4px",
    backgroundColor: theme.optionHoverBackground,
    "&:hover": {
      backgroundColor: theme.optionHoverBackground
    }
  }),
  multiValueLabel: (base, state) => ({
    ...base,
    color: theme.color,
    whiteSpace: "normal",
    wordWrap: "break-word",
    wordBreak: "break-word",
    "&:hover": {
      color: theme.color
    }
  }),
  multiValueRemove: (base, state) => ({
    ...base,
    cursor: "pointer",
    color: theme.color,
    backgroundColor: "inherit",
    opacity: "0.4",
    borderRadius: "inherit",
    "&:hover": {
      color: theme.color,
      backgroundColor: "inherit",
      opacity: "0.75"
    }
  }),
  indicatorsContainer: (base, state) => ({
    ...base,
    backgroundColor: state.isDisabled
      ? theme.disabledValueContainerBackground
      : theme.valueContainerBackground,
    borderTopRightRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem"
  }),
  menu: (base, state) => ({
    ...base,
    zIndex: 1500,
    backgroundColor: theme.menuBackground
  }),
  option: (base, state) => ({
    ...base,
    color: "inherit",
    backgroundColor: "inherit",
    "&:hover": {
      color: theme.color,
      backgroundColor: theme.optionHoverBackground,
      cursor: "pointer"
    }
  })
});

class MultiSelect extends Creatable {
  renderProps = () => ({});

  render() {
    return (
      <Creatable
        styles={this.context.reactSelectStyles}
        classNamePrefix="react-select"
        {...this.renderProps()}
      />
    );
  }
}
MultiSelect.contextType = ThemeContext;

export { MultiSelect, ReactSelectStyles, ReactSelectColors };
