module carbon_credit::oracle {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use std::string;

    /// Authority to verify credits
    struct OracleCap has key {
        id: UID,
        authority: address,
    }

    /// Receipt of verification
    struct VerifierReceipt has key, store {
        id: UID,
        credit_id: UID,
        verifier: address,
        message: string::String,
    }

    /// Create an OracleCap for a trusted verifier
    public entry fun init_oracle(authority: address, ctx: &mut TxContext): OracleCap {
        let id = object::new(ctx);
        OracleCap { id, authority }
    }

    /// Verify a carbon credit and emit a receipt
    public entry fun verify_credit(
        oracle: &OracleCap,
        credit: &mut carbon_credit::CarbonCredit,
        message: string::String,
        ctx: &mut TxContext
    ): VerifierReceipt {
        assert!(oracle.authority == tx_context::sender(ctx), 0);
        credit.verified = true;

        let id = object::new(ctx);
        VerifierReceipt {
            id,
            credit_id: credit.id,
            verifier: oracle.authority,
            message,
        }
    }
}