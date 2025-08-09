module carbon_credit::carbon_credit {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::coin::Coin;
    use sui::sui::SUI;
    use sui::coin;
    use sui::coin::TreasuryCap;


    struct CarbonCredit has key, store {
        id: UID,
        metadata: std::string::String,
        quantity: u64,
        verified: bool,
    }

    public fun mint_credit(
        metadata: std::string::String,
        quantity: u64,
        ctx: &mut TxContext
    ): CarbonCredit {
        let id = object::new(ctx);
        CarbonCredit {
            id,
            metadata,
            quantity,
            verified: false,
        }
    }

    #[allow(lint(custom_state_change))]
    public fun buy_credit(
    credit: CarbonCredit,
    treasury: &mut TreasuryCap<SUI>,
    _buy_creditpayment: Coin<SUI>,
    buyer: address,
    _ctx: &mut TxContext
) {
    // Burn the payment to simulate consumption
    coin::burn<SUI>(treasury, _buy_creditpayment);

    // Transfer ownership of the credit
    transfer::transfer(credit, buyer);
}


    public fun verify_credit(
        credit: &mut CarbonCredit,
        _verifier_sig: vector<u8>
    ) {
        // Optional: validate signature off-chain or via oracle
        credit.verified = true;
    }

    public fun get_metadata(credit: &CarbonCredit): std::string::String {
        credit.metadata
    }

    public fun get_quantity(credit: &CarbonCredit): u64 {
        credit.quantity
    }

    public fun is_verified(credit: &CarbonCredit): bool {
        credit.verified
    }
}