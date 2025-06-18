import React from "react";

const RowProfileEdit = React.forwardRef(
  ({ label, value, disabled = false }, ref) => {
    const capitalFirst = (str) => {
      return str.charAt(0).toUpperCase() + label.substr(1);
    };
    return (
      <>
        <tr className="item">
          <td>
            <b>{capitalFirst(label)}: </b>
          </td>
          <td>
            <input
              disabled={disabled}
              defaultValue={value}
              ref={ref}
              type="text"
              name={label}
              placeholder={label}
              required="required"
              className={`input w-full flex-fill border-gray focus-action-1 color-heading placeholder-main text-center text-md-left sm`}
            />
          </td>
        </tr>
      </>
    );
  },
);

export default RowProfileEdit;
