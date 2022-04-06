import { ActionSchema, HandlerResultSchema, StakeSchema, StateSchema, VoteOptionSchema } from '../../schemas';
import { Transaction } from '../../imports/smartweave/transaction';
import { Block } from '../../imports/smartweave/block';

export function createDispute(state: StateSchema, action: ActionSchema): HandlerResultSchema {
  const id = action.createDispute!!.id;
  const title = action.createDispute!!.title;
  const description = action.createDispute!!.description;

  const options = action.createDispute!!.options;
  const expirationBlocks = action.createDispute!!.expirationBlocks;
  let initialStakeAmount: StakeSchema;
  initialStakeAmount = action.createDispute!!.initialStakeAmount;

  const caller = Transaction.owner();
  const expirationBlock = Block.height() + expirationBlocks;

  if (state.disputes.has(id)) {
    throw new Error(`[CE:NEB] Dispute with following id: ${id} has been already created.`);
  }

  if (initialStakeAmount && (!state.balances.has(caller) || state.balances.get(caller) < initialStakeAmount.amount)) {
    throw new Error(`[CE:NEB] Caller balance not high enough to stake ${initialStakeAmount.amount} token(s)!`);
  }

  let votes: VoteOptionSchema[] = [];

  for (let i = 0; i < options.length; i++) {
    votes.push({ label: options[i], votes: new Map<string, i32>() });
  }

  if (initialStakeAmount) {
    setInitialStakeAmount(votes, initialStakeAmount, caller);
  }

  const withdrawableAmounts: Map<string, i32> = new Map<string, i32>();

  state.disputes.set(id, {
    id,
    title,
    description,
    options,
    votes,
    expirationBlock,
    withdrawableAmounts,
    calculated: false,
  });

  return {
    state,
    dispute: state.disputes.get(id),
    result: null,
  };
}

function setInitialStakeAmount(votes: VoteOptionSchema[], initialStakeAmount: StakeSchema, caller: string): void {
  votes[initialStakeAmount.optionIndex].votes.set(caller, initialStakeAmount.amount);
}