import { TezosNetwork } from "@airgap/tezos";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import assetsSlice, {
  OperationsPayload,
  TezBalancePayload,
  TokenBalancePayload,
} from "./store/assetsSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { getBalance, getOperations, getTokens } from "./tezos";

// TODO: refactor with less repetitions
const getBalancePayload = async (
  pkh: string,
  network: TezosNetwork
): Promise<TezBalancePayload> => {
  const tez = await getBalance(pkh, network);
  return { pkh, tez };
};

const getTokensPayload = async (
  pkh: string,
  network: TezosNetwork
): Promise<TokenBalancePayload> => {
  const tokens = await getTokens(pkh, network);
  return { pkh, tokens };
};

const getOperationsPayload = async (
  pkh: string,
  network: TezosNetwork
): Promise<OperationsPayload> => {
  const operations = await getOperations(pkh, network);
  return { pkh, operations };
};

const assetsActions = assetsSlice.actions;

const REFRESH_RATE = 10000;

export const useAssetsPolling = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((s) => s.accounts.items);
  const network = useAppSelector((s) => s.assets.network);
  const pkhs = accounts.map((a) => a.pkh);

  const tezQuery = useQuery("tezBalance", {
    queryFn: async () => {
      try {
        const balances = await Promise.all(
          pkhs.map((pkh) => getBalancePayload(pkh, network))
        );

        dispatch(assetsActions.updateAssets(balances));
      } catch (error) {
        console.error(error);
      }
    },

    refetchInterval: REFRESH_RATE,
  });

  const tokenQuery = useQuery("tokenBalance", {
    queryFn: async () => {
      try {
        const tokens = await Promise.all(
          pkhs.map((pkh) => getTokensPayload(pkh, network))
        );

        dispatch(assetsActions.updateAssets(tokens));
      } catch (error) {
        console.error(error);
      }
    },

    refetchInterval: REFRESH_RATE,
  });

  const operationsQuery = useQuery("operations", {
    queryFn: async () => {
      try {
        const operations = await Promise.all(
          pkhs.map((pkh) => getOperationsPayload(pkh, network))
        );

        dispatch(assetsActions.updateOperations(operations));
      } catch (error) {
        console.error(error);
      }
    },

    refetchInterval: REFRESH_RATE,
  });

  const tezQueryRef = useRef(tezQuery);
  const tokenQueryRef = useRef(tokenQuery);
  const operationsQueryRef = useRef(operationsQuery);

  // Refetch when network changes
  useEffect(() => {
    tezQueryRef.current.refetch();
    tokenQueryRef.current.refetch();
    operationsQueryRef.current.refetch();
  }, [network]);
};
