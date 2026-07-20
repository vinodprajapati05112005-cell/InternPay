use stylus_sdk::prelude::*;
use stylus_sdk::storage::*;
use alloc::vec::Vec;
use alloc::vec;

#[storage]
pub struct StorageEscrow {
    pub company: StorageAddress,
    pub intern: StorageAddress,
    pub judge: StorageAddress,
    pub total_amount: StorageU256,
    pub funded_amount: StorageU256,
    pub released_amount: StorageU256,
    pub status: StorageU8,
}

#[storage]
pub struct StorageMilestone {
    pub amount: StorageU256,
    pub deadline: StorageU64,
    pub submitted_at: StorageU64,
    pub evaluated_at: StorageU64,
    pub status: StorageU8,
    pub evidence_hash: StorageB256,
}

#[storage]
pub struct StorageDispute {
    pub filed_by: StorageAddress,
    pub evidence_hash: StorageB256,
    pub resolved_at: StorageU64,
    pub status: StorageU8,
    pub decision: StorageU8,
}

#[storage]
#[entrypoint]
pub struct InternPayEscrow {
    pub owner: StorageAddress,
    pub escrow_count: StorageU64,
    pub escrows: StorageMap<u64, StorageEscrow>,
    pub milestones: StorageMap<u64, StorageMap<u32, StorageMilestone>>,
    pub disputes: StorageMap<u64, StorageMap<u32, StorageDispute>>,
}
