module ai_carbon_wallet::transfer_policy {
    use sui::transfer_policy;
    use sui::tx_context::TxContext;
    use sui::package::Publisher;
    use ai_carbon_wallet::energy_nft::CarbonAIPack;

    /// Initialize a basic transfer policy for CarbonAIPack
    /// Note: This requires a Publisher object which would typically be created in package init
    public entry fun init_policy(publisher: &Publisher, ctx: &mut TxContext) {
        let (policy, cap) = transfer_policy::new<CarbonAIPack>(publisher, ctx);
        
        // Transfer policy and cap to sender
        sui::transfer::public_transfer(policy, sui::tx_context::sender(ctx));
        sui::transfer::public_transfer(cap, sui::tx_context::sender(ctx));
    }
}


