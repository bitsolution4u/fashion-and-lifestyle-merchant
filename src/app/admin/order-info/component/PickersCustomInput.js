// ** React Imports
import CustomTextField from "@/@core/components/mui/text-field";
import { forwardRef } from "react";

// eslint-disable-next-line react/display-name
const PickersComponent = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { label, readOnly } = props;

  return (
    <CustomTextField
      {...props}
      inputRef={ref}
      label={label || ""}
      fullWidth
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  );
});

export default PickersComponent;
