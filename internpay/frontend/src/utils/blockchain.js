import {
  BrowserProvider,
  Contract,
  getAddress,
  isAddress,
  keccak256,
  parseEther,
  toUtf8Bytes,
} from 'ethers';
import { getExpectedChainId, getExpectedChainLabel, normalizeChainId } from './wallet';

const ESCROW_ABI = [
  'function createEscrow(address intern, address judge, uint256 total_amount) returns (uint64)',
  'function addMilestone(uint64 escrow_id, uint32 milestone_id, uint256 amount, uint64 deadline)',
  'function lockFunds(uint64 escrow_id) payable',
  'function submitMilestone(uint64 escrow_id, uint32 milestone_id, bytes32 evidence_hash)',
  'function approveMilestone(uint64 escrow_id, uint32 milestone_id)',
  'function rejectMilestone(uint64 escrow_id, uint32 milestone_id)',
  'function cancelEscrow(uint64 escrow_id)',
  'function raiseDispute(uint64 escrow_id, uint32 milestone_id, bytes32 evidence_hash)',
  'function depositDisputeBond(uint64 escrow_id, uint32 milestone_id) payable',
  'function resolveDispute(uint64 escrow_id, uint32 milestone_id, uint8 decision, uint256 released_to_intern, uint256 refunded_to_company)',
  'event EscrowCreated(uint64 indexed escrowId, address indexed company, address indexed intern, uint256 totalAmount)',
  'event FundsDeposited(uint64 indexed escrowId, uint256 amount)',
  'event MilestoneSubmitted(uint64 indexed escrowId, uint32 indexed milestoneId, bytes32 evidenceHash)',
  'event MilestoneApproved(uint64 indexed escrowId, uint32 indexed milestoneId)',
  'event MilestoneRejected(uint64 indexed escrowId, uint32 indexed milestoneId)',
  'event DisputeRaised(uint64 indexed escrowId, uint32 indexed milestoneId, address indexed filedBy, bytes32 evidenceHash)',
  'event DisputeBondDeposited(uint64 indexed escrowId, uint32 indexed milestoneId, address indexed sender, uint256 amount)',
  'event JudgeDecision(uint64 indexed escrowId, uint32 indexed milestoneId, uint8 decision, uint256 releasedToIntern, uint256 refundedToCompany, uint256 judgeReward)',
  'event PaymentReleased(uint64 indexed escrowId, uint256 amount)',
  'event RefundExecuted(uint64 indexed escrowId, uint256 amount)',
  'event EscrowCancelled(uint64 indexed escrowId)',
];

const DISPUTE_DECISION_VALUES = {
  RELEASE_PAYMENT: 1,
  REFUND_COMPANY: 2,
  PARTIAL_PAYMENT: 3,
};

export const DEFAULT_DISPUTE_BOND_ETH = '0.00001';

export const getEscrowContractAddress = () => (import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS || '').trim();

export const hasEscrowContractConfig = () => Boolean(getEscrowContractAddress());

export const getEscrowExplorerBaseUrl = () => (import.meta.env.VITE_EXPLORER_URL || '').trim().replace(/\/$/, '');

export const getEscrowRpcUrl = () => (import.meta.env.VITE_RPC_URL || '').trim();

export const getEscrowExplorerTxUrl = (txHash) => {
  const baseUrl = getEscrowExplorerBaseUrl();
  const hash = String(txHash || '').trim();
  if (!baseUrl || !hash) {
    return '';
  }

  return `${baseUrl}/tx/${hash}`;
};

export const buildEvidenceHash = (payload) => {
  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload ?? {});
  return keccak256(toUtf8Bytes(serialized));
};

export const toEscrowWei = (value) => parseEther(String(value ?? '0'));

export const weiToEthString = (value, precision = 6) => {
  try {
    const wei = typeof value === 'bigint' ? value : BigInt(String(value ?? '0'));
    const sign = wei < 0n ? '-' : '';
    const absolute = wei < 0n ? -wei : wei;
    const whole = absolute / 10n ** 18n;
    const remainder = absolute % 10n ** 18n;

    if (precision <= 0) {
      return `${sign}${whole.toString()}`;
    }

    const fraction = remainder
      .toString()
      .padStart(18, '0')
      .slice(0, precision)
      .replace(/0+$/, '');

    return fraction ? `${sign}${whole.toString()}.${fraction}` : `${sign}${whole.toString()}`;
  } catch {
    return '0';
  }
};

const assertExpectedNetwork = async (provider) => {
  const network = await provider.getNetwork();
  const actualChainId = normalizeChainId(`0x${network.chainId.toString(16)}`);
  const expectedChainId = getExpectedChainId();

  if (expectedChainId && actualChainId !== expectedChainId) {
    throw new Error(`Please switch your wallet to ${getExpectedChainLabel()} before continuing.`);
  }
};

const connectEscrowProvider = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No wallet provider was detected in this browser.');
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  await assertExpectedNetwork(provider);
  const signer = await provider.getSigner();

  return { provider, signer };
};

export const getEscrowContract = async () => {
  const address = getEscrowContractAddress();
  if (!address) {
    throw new Error('Escrow contract address is not configured.');
  }

  if (!isAddress(address)) {
    throw new Error('Escrow contract address is invalid.');
  }

  const { signer } = await connectEscrowProvider();
  return new Contract(getAddress(address), ESCROW_ABI, signer);
};

const parseEvent = (receipt, contract, eventName) => {
  const logs = receipt?.logs || [];
  for (const log of logs) {
    try {
      const parsed = contract.interface.parseLog(log);
      if (parsed?.name === eventName) {
        return parsed;
      }
    } catch {
      // Ignore non-matching logs.
    }
  }
  return null;
};

const resolveDecisionValue = (decision) => {
  const normalized = String(decision || '').trim().toUpperCase();
  return DISPUTE_DECISION_VALUES[normalized] || 0;
};

export const createAndLockEscrow = async ({
  internAddress,
  judgeAddress,
  totalAmountEth,
  milestones = [],
}) => {
  const contract = await getEscrowContract();
  const signerAddress = await contract.runner.getAddress();

  if (!isAddress(internAddress)) {
    throw new Error('A valid student wallet address is required to create the escrow.');
  }

  if (!isAddress(judgeAddress)) {
    throw new Error('A valid judge wallet address is required to create the escrow.');
  }

  const resolvedJudgeAddress = getAddress(judgeAddress);
  const totalWei = toEscrowWei(totalAmountEth);

  if (totalWei <= 0n) {
    throw new Error('The escrow amount must be greater than zero.');
  }

  const createTx = await contract.createEscrow(getAddress(internAddress), resolvedJudgeAddress, totalWei);
  const createReceipt = await createTx.wait();
  const createdEvent = parseEvent(createReceipt, contract, 'EscrowCreated');
  const escrowId = createdEvent?.args?.escrowId ?? createdEvent?.args?.[0];

  if (escrowId === undefined || escrowId === null) {
    throw new Error('Escrow creation succeeded, but no escrow id was returned.');
  }

  const normalizedEscrowId = BigInt(escrowId);

  for (const [index, milestone] of milestones.entries()) {
    const milestoneId = Number(milestone?.order || index + 1);
    const amountWei = toEscrowWei(milestone?.amount || 0);
    const deadlineUnix = Math.floor(new Date(milestone?.deadline || Date.now()).getTime() / 1000);

    if (!milestoneId) {
      throw new Error('Each milestone must have a valid order number.');
    }

    const addTx = await contract.addMilestone(normalizedEscrowId, milestoneId, amountWei, deadlineUnix);
    await addTx.wait();
  }

  const lockTx = await contract.lockFunds(normalizedEscrowId, { value: totalWei });
  await lockTx.wait();

  return {
    escrowId: normalizedEscrowId.toString(),
    createTxHash: createTx.hash,
    lockTxHash: lockTx.hash,
    judgeAddress: resolvedJudgeAddress,
    companyAddress: signerAddress,
  };
};

export const lockExistingEscrowFunds = async ({
  escrowId,
  totalAmountEth,
}) => {
  const contract = await getEscrowContract();
  const totalWei = toEscrowWei(totalAmountEth);
  const tx = await contract.lockFunds(BigInt(escrowId), { value: totalWei });
  await tx.wait();

  return {
    txHash: tx.hash,
  };
};

export const submitMilestoneOnChain = async ({
  escrowId,
  milestoneId,
  evidence,
}) => {
  const contract = await getEscrowContract();
  const tx = await contract.submitMilestone(BigInt(escrowId), Number(milestoneId), buildEvidenceHash(evidence));
  await tx.wait();

  return {
    txHash: tx.hash,
    evidenceHash: buildEvidenceHash(evidence),
  };
};

export const depositDisputeBondOnChain = async ({
  escrowId,
  milestoneId,
  amountEth = DEFAULT_DISPUTE_BOND_ETH,
}) => {
  const contract = await getEscrowContract();
  const bondWei = toEscrowWei(amountEth);
  if (bondWei <= 0n) {
    throw new Error('The dispute bond must be greater than zero.');
  }

  const tx = await contract.depositDisputeBond(BigInt(escrowId), Number(milestoneId), { value: bondWei });
  const receipt = await tx.wait();
  const bondEvent = parseEvent(receipt, contract, 'DisputeBondDeposited');

  return {
    txHash: tx.hash,
    bondWei,
    bondAmountEth: weiToEthString(bondWei),
    sender: bondEvent?.args?.sender ?? bondEvent?.args?.[2] ?? '',
  };
};

export const resolveDisputeOnChain = async ({
  escrowId,
  milestoneId,
  decision,
  releasedToInternWei = 0n,
  refundedToCompanyWei = 0n,
}) => {
  const contract = await getEscrowContract();
  const decisionValue = resolveDecisionValue(decision);
  if (!decisionValue) {
    throw new Error('Invalid dispute decision.');
  }

  const releasedWei = typeof releasedToInternWei === 'bigint' ? releasedToInternWei : BigInt(String(releasedToInternWei ?? 0));
  const refundedWei = typeof refundedToCompanyWei === 'bigint' ? refundedToCompanyWei : BigInt(String(refundedToCompanyWei ?? 0));
  const tx = await contract.resolveDispute(
    BigInt(escrowId),
    Number(milestoneId),
    decisionValue,
    releasedWei,
    refundedWei,
  );
  const receipt = await tx.wait();
  const decisionEvent = parseEvent(receipt, contract, 'JudgeDecision');

  const judgeRewardWei = BigInt(decisionEvent?.args?.judgeReward ?? decisionEvent?.args?.[5] ?? 0n);
  const releasedWeiFromEvent = decisionEvent?.args?.releasedToIntern ?? decisionEvent?.args?.[3] ?? releasedWei;
  const refundedWeiFromEvent = decisionEvent?.args?.refundedToCompany ?? decisionEvent?.args?.[4] ?? refundedWei;

  return {
    txHash: tx.hash,
    releasedToInternWei: typeof releasedWeiFromEvent === 'bigint' ? releasedWeiFromEvent : BigInt(String(releasedWeiFromEvent ?? 0)),
    refundedToCompanyWei: typeof refundedWeiFromEvent === 'bigint' ? refundedWeiFromEvent : BigInt(String(refundedWeiFromEvent ?? 0)),
    judgeRewardWei,
    judgeRewardEth: weiToEthString(judgeRewardWei),
  };
};

export const releaseMilestoneOnChain = async ({
  escrowId,
  milestoneId,
}) => {
  const contract = await getEscrowContract();
  const tx = await contract.approveMilestone(BigInt(escrowId), Number(milestoneId));
  await tx.wait();

  return {
    txHash: tx.hash,
  };
};
