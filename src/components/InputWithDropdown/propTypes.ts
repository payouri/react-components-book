import PropTypes from "prop-types";

export const InputWidthDropdownPropsTypes = {
  customOptionComponent: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  sortBy: PropTypes.oneOf(["label", "value"]).isRequired,
  locale: PropTypes.string,
  autoCompleteOnBlur: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};
