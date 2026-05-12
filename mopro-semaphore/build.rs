fn main() {
    // w2c2's generated base header has a legacy fallback:
    // `typedef enum bool { false = 0, true = 1 } bool;`.
    // On newer host toolchains `bool` may already be a macro from system
    // headers included earlier, which makes that typedef fail during witness
    // compilation. These defines force w2c2 to use C's built-in `_Bool`.
    let existing_cflags = std::env::var("CFLAGS").unwrap_or_default();
    std::env::set_var(
        "CFLAGS",
        format!(
            "{existing_cflags} -D__bool_true_false_are_defined=1 -Dbool=_Bool -Dtrue=1 -Dfalse=0"
        ),
    );

    rust_witness::transpile::transpile_wasm("../client/public/zk".to_string());
}
