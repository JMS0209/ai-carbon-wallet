module RoleAccess {

    use std::vector;
    use sui::tx_context::{TxContext};
    use sui::object::{Self, UID};

    struct Role has key {
        id: UID,
        admins: vector<address>,
        oracles: vector<address>,
    }

    public fun init(ctx: &mut TxContext): Role {
        Role {
            id: object::new(ctx),
            admins: vector::empty<address>(),
            oracles: vector::empty<address>(),
        }
    }

    public fun add_admin(role: &mut Role, addr: address) {
        vector::push_back(&mut role.admins, addr);
    }

    public fun add_oracle(role: &mut Role, addr: address) {
        vector::push_back(&mut role.oracles, addr);
    }

    public fun is_admin(role: &Role, addr: address): bool {
        vector::contains(&role.admins, addr)
    }

    public fun is_oracle(role: &Role, addr: address): bool {
        vector::contains(&role.oracles, addr)
    }

    public fun restricted_action(role: &Role, caller: address) {
        assert!(is_admin(role, caller), 0);
        // privileged logic here
    }
}
