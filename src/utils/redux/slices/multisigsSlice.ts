import { createSlice } from "@reduxjs/toolkit";
import { groupBy } from "lodash";
import { Multisig, MultisigOperation, MultisigPendingOperations } from "../../multisig/types";

export type State = {
  items: Multisig[];
  pendingOperations: MultisigPendingOperations;
};

const initialState: State = { items: [], pendingOperations: {} };

const multisigsSlice = createSlice({
  name: "multisigs",
  initialState,
  reducers: {
    reset: () => initialState,
    setMultisigs: (state, { payload }: { payload: Multisig[] }) => {
      state.items = payload;
    },
    setPendingOperations: (state, { payload }: { payload: MultisigOperation[] }) => {
      state.pendingOperations = groupBy(payload, operation => operation.bigmapId);
    },
  },
});

export const multisigActions = multisigsSlice.actions;

export default multisigsSlice;