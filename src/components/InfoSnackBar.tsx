import React from "react";
import { Alert, Snackbar } from "@mui/material";
import create from "zustand";

type SnackBarStoreStore = {
  message: string;
  type: any;
  open: boolean;
  close: () => void;
};

const useSnackBarStore = create<SnackBarStoreStore>((set) => ({
  message: "",
  open: false,
  type: undefined,
  close: () => set({ open: false }),
}));

export const showSnackBar = (message: string, type: any) => {
  useSnackBarStore.setState({
    open: true,
    message: message,
    type: type,
  });
};

export const InfoSnackBar = () => {
  const { message, type, open, close } = useSnackBarStore();
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      autoHideDuration={2500}
      onClose={close}
    >
      <Alert onClose={close} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default InfoSnackBar;
