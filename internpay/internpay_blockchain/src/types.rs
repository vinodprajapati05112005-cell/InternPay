use alloy_sol_types::sol;

sol! {
    #[derive(Debug, PartialEq, Eq)]
    enum EscrowStatus {
        Draft,
        Funded,
        Completed,
        Cancelled,
        Disputed
    }

    #[derive(Debug, PartialEq, Eq)]
    enum MilestoneStatus {
        Open,
        Submitted,
        Approved,
        Rejected,
        Disputed
    }

    #[derive(Debug, PartialEq, Eq)]
    enum DisputeDecision {
        None,
        Release,
        Refund,
        Split
    }
}
