#![cfg_attr(not(feature = "export-abi"), no_main)]
#![cfg_attr(not(feature = "export-abi"), no_std)]

extern crate alloc;

pub mod types;
pub mod errors;
pub mod events;
pub mod storage;

use stylus_sdk::{
    prelude::*,
    alloy_primitives::{Address, B256, U256, U64, U8},
    call::transfer::transfer_eth,
};
use crate::errors::InternPayError;
use alloc::vec::Vec;

#[public]
impl storage::InternPayEscrow {
    pub fn is_alive(&self) -> bool {
        true
    }

    pub fn initialize(&mut self) -> Result<(), Vec<u8>> {
        let current_owner = self.owner.get();
        if !current_owner.is_zero() {
            return Err(InternPayError::Unauthorized.into());
        }
        self.owner.set(self.vm().msg_sender());
        Ok(())
    }

    pub fn create_escrow(
        &mut self,
        intern: Address,
        judge: Address,
        total_amount: U256,
    ) -> Result<u64, Vec<u8>> {
        if intern.is_zero() || judge.is_zero() {
            return Err(InternPayError::InvalidJudge.into());
        }
        if total_amount.is_zero() {
            return Err(InternPayError::InvalidAmount.into());
        }

        let count = self.escrow_count.get().to::<u64>() + 1;
        self.escrow_count.set(U64::from(count));

        let sender = self.vm().msg_sender();
        let mut escrow = self.escrows.setter(count);
        escrow.company.set(sender);
        escrow.intern.set(intern);
        escrow.judge.set(judge);
        escrow.total_amount.set(total_amount);
        escrow.funded_amount.set(U256::ZERO);
        escrow.released_amount.set(U256::ZERO);
        escrow.status.set(U8::from(types::EscrowStatus::Draft as u8));
        drop(escrow);

        self.vm().log(events::EscrowCreated {
            escrowId: count,
            company: sender,
            intern,
            totalAmount: total_amount,
        });

        Ok(count)
    }

    pub fn add_milestone(
        &mut self,
        escrow_id: u64,
        milestone_id: u32,
        amount: U256,
        deadline: u64,
    ) -> Result<(), Vec<u8>> {
        let sender = self.vm().msg_sender();
        let mut escrow = self.escrows.setter(escrow_id);
        if escrow.company.get() != sender {
            return Err(InternPayError::Unauthorized.into());
        }
        if escrow.status.get().to::<u8>() != types::EscrowStatus::Draft as u8 {
            return Err(InternPayError::InvalidState.into());
        }
        if amount.is_zero() {
            return Err(InternPayError::InvalidAmount.into());
        }
        drop(escrow);

        let mut milestones_map = self.milestones.setter(escrow_id);
        let mut milestone = milestones_map.setter(milestone_id);
        milestone.amount.set(amount);
        milestone.deadline.set(U64::from(deadline));
        milestone.status.set(U8::from(types::MilestoneStatus::Open as u8));
        milestone.submitted_at.set(U64::ZERO);
        milestone.evaluated_at.set(U64::ZERO);
        milestone.evidence_hash.set(B256::ZERO);

        Ok(())
    }

    #[payable]
    pub fn lock_funds(&mut self, escrow_id: u64) -> Result<(), Vec<u8>> {
        let sender = self.vm().msg_sender();
        let value = self.vm().msg_value();

        let mut escrow = self.escrows.setter(escrow_id);
        if escrow.company.get() != sender {
            return Err(InternPayError::Unauthorized.into());
        }
        if escrow.status.get().to::<u8>() != types::EscrowStatus::Draft as u8 {
            return Err(InternPayError::InvalidState.into());
        }

        let total_needed = escrow.total_amount.get();
        if value != total_needed {
            return Err(InternPayError::InsufficientFunds.into());
        }

        escrow.funded_amount.set(value);
        escrow.status.set(U8::from(types::EscrowStatus::Funded as u8));
        drop(escrow);

        self.vm().log(events::FundsDeposited {
            escrowId: escrow_id,
            amount: value,
        });

        Ok(())
    }

    pub fn submit_milestone(
        &mut self,
        escrow_id: u64,
        milestone_id: u32,
        evidence_hash: B256,
    ) -> Result<(), Vec<u8>> {
        let sender = self.vm().msg_sender();
        let now = self.vm().block_timestamp();

        let escrow = self.escrows.getter(escrow_id);
        if escrow.intern.get() != sender {
            return Err(InternPayError::Unauthorized.into());
        }
        if escrow.status.get().to::<u8>() != types::EscrowStatus::Funded as u8 {
            return Err(InternPayError::InvalidState.into());
        }
        drop(escrow);

        let mut milestones_map = self.milestones.setter(escrow_id);
        let mut milestone = milestones_map.setter(milestone_id);
        let m_status = milestone.status.get().to::<u8>();
        if m_status != types::MilestoneStatus::Open as u8 && m_status != types::MilestoneStatus::Rejected as u8 {
            return Err(InternPayError::InvalidState.into());
        }

        let deadline = milestone.deadline.get().to::<u64>();
        if deadline > 0 && now > deadline {
            return Err(InternPayError::DeadlinePassed.into());
        }

        milestone.submitted_at.set(U64::from(now));
        milestone.status.set(U8::from(types::MilestoneStatus::Submitted as u8));
        milestone.evidence_hash.set(evidence_hash);
        drop(milestone);
        drop(milestones_map);

        self.vm().log(events::MilestoneSubmitted {
            escrowId: escrow_id,
            milestoneId: milestone_id,
            evidenceHash: evidence_hash,
        });

        Ok(())
    }

    pub fn approve_milestone(&mut self, escrow_id: u64, milestone_id: u32) -> Result<(), Vec<u8>> {
        let sender = self.vm().msg_sender();
        let now = self.vm().block_timestamp();

        let escrow_company = self.escrows.getter(escrow_id).company.get();
        if escrow_company != sender {
            return Err(InternPayError::Unauthorized.into());
        }
        let escrow_status = self.escrows.getter(escrow_id).status.get().to::<u8>();
        if escrow_status != types::EscrowStatus::Funded as u8 {
            return Err(InternPayError::InvalidState.into());
        }

        let mut milestones_map = self.milestones.setter(escrow_id);
        let mut milestone = milestones_map.setter(milestone_id);
        if milestone.status.get().to::<u8>() != types::MilestoneStatus::Submitted as u8 {
            return Err(InternPayError::InvalidState.into());
        }

        milestone.status.set(U8::from(types::MilestoneStatus::Approved as u8));
        milestone.evaluated_at.set(U64::from(now));

        let amount = milestone.amount.get();
        drop(milestone);
        drop(milestones_map);

        let mut escrow = self.escrows.setter(escrow_id);
        let intern = escrow.intern.get();

        if amount > U256::ZERO {
            let total_amount = escrow.total_amount.get();
            let old_released = escrow.released_amount.get();
            drop(escrow);

            transfer_eth(self.vm(), intern, amount).map_err(|_| InternPayError::TransferFailed)?;

            let mut escrow = self.escrows.setter(escrow_id);
            let new_released = old_released + amount;
            escrow.released_amount.set(new_released);
            
            let is_completed = new_released == total_amount;
            if is_completed {
                escrow.status.set(U8::from(types::EscrowStatus::Completed as u8));
            }
            drop(escrow);

            self.vm().log(events::PaymentReleased {
                escrowId: escrow_id,
                amount,
            });
        } else {
            drop(escrow);
        }

        self.vm().log(events::MilestoneApproved {
            escrowId: escrow_id,
            milestoneId: milestone_id,
        });

        Ok(())
    }

    pub fn reject_milestone(&mut self, escrow_id: u64, milestone_id: u32) -> Result<(), Vec<u8>> {
        let sender = self.vm().msg_sender();
        let now = self.vm().block_timestamp();

        let escrow = self.escrows.getter(escrow_id);
        if escrow.company.get() != sender {
            return Err(InternPayError::Unauthorized.into());
        }
        if escrow.status.get().to::<u8>() != types::EscrowStatus::Funded as u8 {
            return Err(InternPayError::InvalidState.into());
        }
        drop(escrow);

        let mut milestones_map = self.milestones.setter(escrow_id);
        let mut milestone = milestones_map.setter(milestone_id);
        if milestone.status.get().to::<u8>() != types::MilestoneStatus::Submitted as u8 {
            return Err(InternPayError::InvalidState.into());
        }

        milestone.status.set(U8::from(types::MilestoneStatus::Rejected as u8));
        milestone.evaluated_at.set(U64::from(now));
        drop(milestone);
        drop(milestones_map);

        self.vm().log(events::MilestoneRejected {
            escrowId: escrow_id,
            milestoneId: milestone_id,
        });

        Ok(())
    }

    pub fn cancel_escrow(&mut self, escrow_id: u64) -> Result<(), Vec<u8>> {
        let sender = self.vm().msg_sender();

        let mut escrow = self.escrows.setter(escrow_id);
        let company = escrow.company.get();
        if company != sender {
            return Err(InternPayError::Unauthorized.into());
        }

        let status = escrow.status.get().to::<u8>();
        if status != types::EscrowStatus::Draft as u8 && status != types::EscrowStatus::Funded as u8 {
            return Err(InternPayError::InvalidState.into());
        }

        if status == types::EscrowStatus::Funded as u8 {
            let funded = escrow.funded_amount.get();
            let released = escrow.released_amount.get();
            if funded > released {
                let refund_amount = funded - released;
                drop(escrow);

                transfer_eth(self.vm(), company, refund_amount).map_err(|_| InternPayError::TransferFailed)?;
                
                self.vm().log(events::RefundExecuted {
                    escrowId: escrow_id,
                    amount: refund_amount,
                });
                
                escrow = self.escrows.setter(escrow_id);
            }
        }

        escrow.status.set(U8::from(types::EscrowStatus::Cancelled as u8));
        drop(escrow);

        self.vm().log(events::EscrowCancelled { escrowId: escrow_id });

        Ok(())
    }

    pub fn raise_dispute(
        &mut self,
        escrow_id: u64,
        milestone_id: u32,
        evidence_hash: B256,
    ) -> Result<(), Vec<u8>> {
        let sender = self.vm().msg_sender();

        let mut escrow = self.escrows.setter(escrow_id);
        let is_company = escrow.company.get() == sender;
        let is_intern = escrow.intern.get() == sender;

        if !is_company && !is_intern {
            return Err(InternPayError::Unauthorized.into());
        }

        if escrow.status.get().to::<u8>() != types::EscrowStatus::Funded as u8 {
            return Err(InternPayError::InvalidState.into());
        }

        escrow.status.set(U8::from(types::EscrowStatus::Disputed as u8));
        drop(escrow);

        let mut milestones_map = self.milestones.setter(escrow_id);
        let mut milestone = milestones_map.setter(milestone_id);
        let m_status = milestone.status.get().to::<u8>();
        if m_status != types::MilestoneStatus::Submitted as u8 && m_status != types::MilestoneStatus::Rejected as u8 {
            return Err(InternPayError::InvalidState.into());
        }

        milestone.status.set(U8::from(types::MilestoneStatus::Disputed as u8));
        drop(milestone);
        drop(milestones_map);

        let mut disputes_map = self.disputes.setter(escrow_id);
        let mut dispute = disputes_map.setter(milestone_id);
        dispute.filed_by.set(sender);
        dispute.evidence_hash.set(evidence_hash);
        dispute.resolved_at.set(U64::ZERO);
        dispute.status.set(U8::from(1));
        dispute.decision.set(U8::from(types::DisputeDecision::None as u8));
        drop(dispute);
        drop(disputes_map);

        self.vm().log(events::DisputeRaised {
            escrowId: escrow_id,
            milestoneId: milestone_id,
            filedBy: sender,
            evidenceHash: evidence_hash,
        });

        Ok(())
    }

    pub fn resolve_dispute(
        &mut self,
        escrow_id: u64,
        milestone_id: u32,
        decision: u8,
        released_to_intern: U256,
        refunded_to_company: U256,
    ) -> Result<(), Vec<u8>> {
        let sender = self.vm().msg_sender();
        let now = self.vm().block_timestamp();

        let escrow = self.escrows.getter(escrow_id);
        let judge = escrow.judge.get();
        if judge != sender {
            return Err(InternPayError::Unauthorized.into());
        }

        if escrow.status.get().to::<u8>() != types::EscrowStatus::Disputed as u8 {
            return Err(InternPayError::InvalidState.into());
        }
        let intern = escrow.intern.get();
        let company = escrow.company.get();
        let old_released = escrow.released_amount.get();
        let old_funded = escrow.funded_amount.get();
        drop(escrow);

        let milestones_map = self.milestones.getter(escrow_id);
        let milestone = milestones_map.getter(milestone_id);
        if milestone.status.get().to::<u8>() != types::MilestoneStatus::Disputed as u8 {
            return Err(InternPayError::InvalidState.into());
        }

        let milestone_amount = milestone.amount.get();
        if released_to_intern + refunded_to_company != milestone_amount {
            return Err(InternPayError::InvalidAmount.into());
        }
        drop(milestone);
        drop(milestones_map);

        if decision != types::DisputeDecision::Release as u8
            && decision != types::DisputeDecision::Refund as u8
            && decision != types::DisputeDecision::Split as u8
        {
            return Err(InternPayError::InvalidState.into());
        }

        if released_to_intern > U256::ZERO {
            transfer_eth(self.vm(), intern, released_to_intern).map_err(|_| InternPayError::TransferFailed)?;
        }

        if refunded_to_company > U256::ZERO {
            transfer_eth(self.vm(), company, refunded_to_company).map_err(|_| InternPayError::TransferFailed)?;
        }

        let mut disputes_map = self.disputes.setter(escrow_id);
        let mut dispute = disputes_map.setter(milestone_id);
        dispute.resolved_at.set(U64::from(now));
        dispute.decision.set(U8::from(decision));
        dispute.status.set(U8::from(2));
        drop(dispute);
        drop(disputes_map);

        let mut milestones_map = self.milestones.setter(escrow_id);
        let mut milestone = milestones_map.setter(milestone_id);
        if decision == types::DisputeDecision::Release as u8 {
            milestone.status.set(U8::from(types::MilestoneStatus::Approved as u8));
        } else if decision == types::DisputeDecision::Refund as u8 {
            milestone.status.set(U8::from(types::MilestoneStatus::Rejected as u8));
        } else {
            milestone.status.set(U8::from(types::MilestoneStatus::Approved as u8));
        }
        milestone.evaluated_at.set(U64::from(now));
        drop(milestone);
        drop(milestones_map);

        let mut escrow = self.escrows.setter(escrow_id);
        let new_released = old_released + released_to_intern;
        escrow.released_amount.set(new_released);
        let funded = old_funded - refunded_to_company;
        escrow.funded_amount.set(funded);
        let released = escrow.released_amount.get();
        if released == funded {
            escrow.status.set(U8::from(types::EscrowStatus::Completed as u8));
        } else {
            escrow.status.set(U8::from(types::EscrowStatus::Funded as u8));
        }
        drop(escrow);

        self.vm().log(events::JudgeDecision {
            escrowId: escrow_id,
            milestoneId: milestone_id,
            decision,
            releasedToIntern: released_to_intern,
            refundedToCompany: refunded_to_company,
        });

        Ok(())
    }
}
