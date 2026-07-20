use alloy_sol_types::sol;
use alloc::vec::Vec;

sol! {
    error ErrorUnauthorized();
    error ErrorInvalidState();
    error ErrorInsufficientFunds();
    error ErrorDeadlinePassed();
    error ErrorDeadlineNotPassed();
    error ErrorInvalidJudge();
    error ErrorDuplicateSubmission();
    error ErrorTransferFailed();
    error ErrorInvalidAmount();
    error ErrorEscrowNotFound();
    error ErrorMilestoneNotFound();
}

#[derive(Debug)]
pub enum InternPayError {
    Unauthorized,
    InvalidState,
    InsufficientFunds,
    DeadlinePassed,
    DeadlineNotPassed,
    InvalidJudge,
    DuplicateSubmission,
    TransferFailed,
    InvalidAmount,
    EscrowNotFound,
    MilestoneNotFound,
}

impl From<InternPayError> for Vec<u8> {
    fn from(err: InternPayError) -> Self {
        use alloy_sol_types::SolError;
        match err {
            InternPayError::Unauthorized => ErrorUnauthorized {}.abi_encode(),
            InternPayError::InvalidState => ErrorInvalidState {}.abi_encode(),
            InternPayError::InsufficientFunds => ErrorInsufficientFunds {}.abi_encode(),
            InternPayError::DeadlinePassed => ErrorDeadlinePassed {}.abi_encode(),
            InternPayError::DeadlineNotPassed => ErrorDeadlineNotPassed {}.abi_encode(),
            InternPayError::InvalidJudge => ErrorInvalidJudge {}.abi_encode(),
            InternPayError::DuplicateSubmission => ErrorDuplicateSubmission {}.abi_encode(),
            InternPayError::TransferFailed => ErrorTransferFailed {}.abi_encode(),
            InternPayError::InvalidAmount => ErrorInvalidAmount {}.abi_encode(),
            InternPayError::EscrowNotFound => ErrorEscrowNotFound {}.abi_encode(),
            InternPayError::MilestoneNotFound => ErrorMilestoneNotFound {}.abi_encode(),
        }
    }
}
