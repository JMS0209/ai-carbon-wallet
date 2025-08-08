module ai_carbon_wallet::transfer_policy {
    use sui::transfer_policy::{Self, TransferPolicy};
    use sui::tx_context::{Self, TxContext};
    use ai_carbon_wallet::energy_nft::CarbonAIPack;

    /// Initialize a basic transfer policy for CarbonAIPack
    public entry fun init_policy(ctx: &mut TxContext) {
        let _p: TransferPolicy<CarbonAIPack> = transfer_policy::new<CarbonAIPack>(ctx);
    }
}


