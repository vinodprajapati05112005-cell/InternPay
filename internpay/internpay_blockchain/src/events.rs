use alloy_sol_types::sol;

sol! {
    event EscrowCreated(uint64 indexed escrowId, address indexed company, address indexed intern, uint256 totalAmount);
    event FundsDeposited(uint64 indexed escrowId, uint256 amount);
    event MilestoneSubmitted(uint64 indexed escrowId, uint32 indexed milestoneId, bytes32 evidenceHash);
    event MilestoneApproved(uint64 indexed escrowId, uint32 indexed milestoneId);
    event MilestoneRejected(uint64 indexed escrowId, uint32 indexed milestoneId);
    event DisputeRaised(uint64 indexed escrowId, uint32 indexed milestoneId, address indexed filedBy, bytes32 evidenceHash);
    event DisputeBondDeposited(uint64 indexed escrowId, uint32 indexed milestoneId, address indexed sender, uint256 amount);
    event JudgeDecision(uint64 indexed escrowId, uint32 indexed milestoneId, uint8 decision, uint256 releasedToIntern, uint256 refundedToCompany, uint256 judgeReward);
    event PaymentReleased(uint64 indexed escrowId, uint256 amount);
    event RefundExecuted(uint64 indexed escrowId, uint256 amount);
    event EscrowCancelled(uint64 indexed escrowId);
}
