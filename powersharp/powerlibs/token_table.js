let tokens = {
    initialize_program: "namespace",
    package_definition: "package",
    open_block: "do",
    end_block: "end",
    commentary: "#",
    variable_assignment: "=",
    variable_reassignment: ":=",
    array_symbol: "[]",
    builtin_library_require: "using",
    package_importing: "import",
    package_including: "include",
    function_definition: "def",
    return_value: "return",
    struct_create: "struct",
    struct_declare: "declare",
    conditional_if: "if",
    conditional_elsif: "elsif",
    conditional_final: "else",
    loop_while: "while",
    loop_for: "for",
    to_for: "to",
    times: "times",
    break_loop: "break",
    continue_loop: "continue",
    error_decorator: "@error",

    typedef_integer: "int",
    typedef_float: "float",
    typedef_string: "string",
    typedef_boolean: "bool",

    power_sample: "/usr/local/powersharp-sample",
    power_sample_win32: "power_sample",
    local_modules: "powersharp_modules",
    init_module: "init.go"
}


module.exports = { tokens }