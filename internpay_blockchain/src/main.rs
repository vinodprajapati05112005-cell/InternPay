use internpay_escrow::storage::InternPayEscrow;

fn main() {
    stylus_sdk::abi::export::handle_license_and_pragma();
    stylus_sdk::abi::export::print_from_args::<InternPayEscrow>();
}
