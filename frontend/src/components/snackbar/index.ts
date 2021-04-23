import { snackbar } from "mdui";
const SnackBar = (
  message: string,
  position:
    | "top"
    | "bottom"
    | "right-top"
    | "right-bottom"
    | "left-top"
    | "left-bottom" = "top"
) => {
  return snackbar({ message, position });
};
export { SnackBar };
export default SnackBar;
