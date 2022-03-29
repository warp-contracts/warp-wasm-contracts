@serializable
export class StateSchema {
  balances: Map<string, i32> = new Map<string, i32>();
  canEvolve: boolean;
  evolve: string | null;
  name: string;
  owner: string;
  ticker: string;
  disputes: Map<string, DisputeSchema> = new Map<string, DisputeSchema>();
}

@serializable
export class DisputeSchema {
  id: string;
  title: string;
  description: string;
  options: string[];
  votes: Map<string, i32>[];
  expirationBlock: i32;
  withdrawableAmounts: Map<string, i32>;
  calculated: boolean;
}

@serializable
export class ActionSchema {
  function: string;
  contractTxId: string | null;
  value: string | null;
  balance: BalanceSchema | null;
  mint: MintSchema | null;
  transfer: TransferSchema | null;
  createDispute: CreateDisputeSchema | null;
  vote: VoteSchema | null;
  withdrawReward: WithdrawRewardSchema | null;
}

@serializable
export class BalanceSchema {
  target: string;
}

@serializable
export class MintSchema {
  qty: i32;
}

@serializable
export class TransferSchema {
  target: string;
  qty: i32;
}

@serializable
export class CreateDisputeSchema {
  id: string;
  title: string;
  description: string;
  options: string[];
  expirationBlocks: i32;
  initialStakeAmount: i32;
}

@serializable
export class VoteSchema {
  id: string;
  selectedOptionIndex: i32;
  stakeAmount: i32;
}

export class WithdrawRewardSchema {
  id: string;
}

@serializable
export class ResultSchema {
  balance: i32;
  target: string;
  ticker: string;
}

@serializable
export class HandlerResultSchema {
  state: StateSchema;
  dispute: DisputeSchema | null;
  result: ResultSchema | null;
}
