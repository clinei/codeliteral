let Code_Kind = {
	IF: "if",
	ELSE: "else",
	WHILE: "while",
	FOR: "for",
	BREAK: "break",
	CONTINUE: "continue",
	IDENT: "ident",
	ASSIGN: "assign",
	OPASSIGN: "opassign",
	BLOCK: "block",
	PROCEDURE: "procedure",
	DECLARATION: "declaration",
	CALL: "call",
	RETURN: "return",
	BINARY_OPERATION: "binop",
	LITERAL: "literal",
};

let Code_Node = {
	kind: null,
	type: null,
	serial: null
};
let next_serial = 0;
function make_node() {

	let node = Object.assign({}, Code_Node);
	node.serial = next_serial;

	next_serial += 1;

	return node;
}

let Code_Procedure = {

	base: null,

	parameters: null,
	return_type: null,
};
function make_procedure(parameters, return_type, block) {

	let procedure = Object.assign({}, Code_Procedure);
	procedure.base = make_node();
	procedure.base.kind = Code_Kind.PROCEDURE;

	procedure.parameters = parameters ? parameters : [];
	procedure.return_type = return_type ? return_type : Types.void;
	procedure.block = block;

	return procedure;
}

let Code_Call = {

	base: null,

    ident: null,
	args: null,
};
function make_call(ident, args) {

	let call = Object.assign({}, Code_Call);
	call.base = make_node();
	call.base.kind = Code_Kind.CALL;

	call.ident = ident;
	call.args = args ? args : [];

	return call;
}

let Code_Declaration = {

	base: null,

	ident: null,
	expression: null,
	type: null
};
function make_declaration(ident, expression, type) {

	let declaration = Object.assign({}, Code_Declaration);
	declaration.base = make_node();
	declaration.base.kind = Code_Kind.DECLARATION;

	ident.declaration = declaration;

	declaration.ident = ident;
	declaration.expression = expression;
	declaration.type = type;

	return declaration;
}

let Code_Block = {

	base: null,

	statements: null
};
function make_block(statements) {

	let block = Object.assign({}, Code_Block);
	block.base = make_node();
	block.base.kind = Code_Kind.BLOCK;

	block.statements = statements;

	if (!block.statements) {

		block.statements = new Array();
	}

	return block;
}

let Code_Return = {

	base: null,

	expression: null
};
function make_return(expression) {

	let return_ = Object.assign({}, Code_Return);
	return_.base = make_node();
	return_.base.kind = Code_Kind.RETURN;

	return_.expression = expression;

	return return_;
}

let Code_If = {

	base: null,

	condition: null,
	expression: null
};
function make_if(condition, expression) {

	let if_ = Object.assign({}, Code_If);
	if_.base = make_node();
	if_.base.kind = Code_Kind.IF;

	if_.condition = condition;
	if_.expression = expression;

	return if_;
}

let Code_Else = {

	base: null,

	expression: null
};
function make_else(expression) {

	let else_ = Object.assign({}, Code_Else);
	else_.base = make_node();
	else_.base.kind = Code_Kind.ELSE;

	else_.expression = expression;

	return else_;
}

let Code_While = {

	base: null,

	condition: null,
	expression: null
};
function make_while(condition, expression) {

	let while_ = Object.assign({}, Code_While);
	while_.base = make_node();
	while_.base.kind = Code_Kind.WHILE;

	while_.condition = condition;
	while_.expression = expression;

	return while_;
}

let Code_For = {

	base: null,

	begin: null,
	condition: null,
	cycle_end: null,
	expression: null
};
function make_for(begin, condition, cycle_end, expression) {

	let for_ = Object.assign({}, Code_For);
	for_.base = make_node();
	for_.base.kind = Code_Kind.FOR;

	for_.begin = begin;
	for_.condition = condition;
	for_.cycle_end = cycle_end;
	for_.expression = expression;

	return for_;
}

let Code_Break = {

	base: null,
};
function make_break() {

	let break_ = Object.assign({}, Code_Break);
	break_.base = make_node();
	break_.base.kind = Code_Kind.BREAK;

	return break_;
}

let Code_Continue = {

	base: null,
};
function make_continue() {

	let continue_ = Object.assign({}, Code_Continue);
	continue_.base = make_node();
	continue_.base.kind = Code_Kind.CONTINUE;

	return continue_;
}

let Code_Assign = {

	base: null,

	ident: null,
	expression: null
};
function make_assign(ident, expression) {

	let assign = Object.assign({}, Code_Assign);
	assign.base = make_node();
	assign.base.kind = Code_Kind.ASSIGN;

	assign.ident = ident;
	assign.expression = expression;

	return assign;
}

let Code_OpAssign = {

	base: null,

	ident: null,
	operation_type: null,
	expression: null
};
function make_opassign(ident, operation_type, expression) {

	let opassign = Object.assign({}, Code_OpAssign);
	opassign.base = make_node();
	opassign.base.kind = Code_Kind.OPASSIGN;

	opassign.ident = ident;
	opassign.operation_type = operation_type;
	opassign.expression = expression;

	return opassign;
}

let Code_Binary_Operation = {

	base: null,

	operation_type: null,
	left: null,
	right: null
};
function make_binary_operation(left, operation_type, right) {

	let binary_operation = Object.assign({}, Code_Binary_Operation);
	binary_operation.base = make_node();
	binary_operation.base.kind = Code_Kind.BINARY_OPERATION;

	binary_operation.left = left;
	binary_operation.operation_type = operation_type;
	binary_operation.right = right;

	return binary_operation;
}

let Code_Ident = {

	base: null,

	original: null,
	name: null,
	declaration: null
};
function make_ident(name, declaration) {

	let ident = Object.assign({}, Code_Ident);
	ident.base = make_node();
	ident.base.kind = Code_Kind.IDENT;

	ident.original = ident;
	ident.name = name;
	ident.declaration = declaration;

	return ident;
}

let Code_Literal = {

	base: null,

	value: null
};
function make_literal(value) {

	let literal = Object.assign({}, Code_Literal);
	literal.base = make_node();
	literal.base.kind = Code_Kind.LITERAL;

	literal.value = value;

	return literal;
}

let Type_Kind = {
    INTEGER: "integer",
    FLOAT: "float",
    VOID: "void",
};
let Type_Info = {
    kind: null,
};
let Type_Info_Integer = {
    base: null,

    size_in_bytes: null,
    signed: null,
};
function make_type_info() {
    let info = Object.assign({}, Type_Info);
    return info;
}
function make_type_info_integer(size_in_bytes, signed) {
    let info = Object.assign({}, make_type_info());
    info.kind = Type_Kind.INTEGER;

    info.size_in_bytes = size_in_bytes;
    info.signed = signed;

    return info;
}
function make_type_info_float(size_in_bytes) {
    let info = Object.assign({}, make_type_info());
    info.kind = Type_Kind.FLOAT;

    info.size_in_bytes = size_in_bytes;
    
    return info;
}
function make_type_info_void() {
    let info = Object.assign({}, make_type_info());
    info.kind = Type_Kind.VOID;

    return info;
}

let Types = {
    "char": make_type_info_integer(1, false),
    "signed char": make_type_info_integer(1, true),
    "unsigned char": make_type_info_integer(1, false),
    "short": make_type_info_integer(2, true),
    "short int": make_type_info_integer(2, true),
    "signed short": make_type_info_integer(2, true),
    "signed short int": make_type_info_integer(2, true),
    "unsigned short": make_type_info_integer(2, false),
    "unsigned short int": make_type_info_integer(2, false),
    "int": make_type_info_integer(4, true),
    "signed": make_type_info_integer(4, true),
    "signed int": make_type_info_integer(4, true),
    "unsigned": make_type_info_integer(4, false),
    "unsigned int": make_type_info_integer(4, false),
    "long": make_type_info_integer(4, true),
    "long int": make_type_info_integer(4, true),
    "signed long": make_type_info_integer(4, true),
    "signed long int": make_type_info_integer(4, true),
    "unsigned long": make_type_info_integer(4, false),
    "unsigned long int": make_type_info_integer(4, false),
    "long long": make_type_info_integer(8, true),
    "long long int": make_type_info_integer(8, true),
    "signed long long": make_type_info_integer(8, true),
    "signed long long int": make_type_info_integer(8, true),
    "unsigned long long": make_type_info_integer(8, false),
    "unsigned long long int": make_type_info_integer(8, false),
    "float": make_type_info_float(4),
    "double": make_type_info_float(8),
    "long double": make_type_info_float(12),
    "void": make_type_info_void(),
};

function infer_decl_of_ident(ident) {
    for (let i = infer_block_stack.length-1; i >= 0; i -= 1) {
        let block = infer_block_stack[i];
        for (let j = 0; j < block.declarations.length; j += 1) {
            let decl = block.declarations[j];
            if (decl.ident.name == ident.name) {
                return decl;
            }
        }
    }
}
let infer_block_stack = new Array();
function infer(node) {
    let last_block = infer_block_stack[infer_block_stack.length-1];
    if (node.base.kind == Code_Kind.BLOCK) {
        if (!node.declarations) {
            node.declarations = new Array();
        }
        infer_block_stack.push(node);
        for (let stmt of node.statements) {
            infer(stmt);
        }
        infer_block_stack.pop();
    }
    else if (node.base.kind == Code_Kind.DECLARATION) {
        // should error here when ident already declared in current scope
        if (last_block) {
            last_block.declarations.push(node);
        }
        if (node.type) {
            let type = Types[node.type.name];
            if (!type) {
                type = infer(node.type);
            }
            node.ident.base.type = type;
        }
        if (node.expression && node.expression.base) {
            infer(node.expression);
        }
    }
    else if (node.base.kind == Code_Kind.ASSIGN) {
        infer(node.ident);
        infer(node.expression);
    }
    else if (node.base.kind == Code_Kind.OPASSIGN) {
        infer(node.ident);
        infer(node.expression);
    }
    else if (node.base.kind == Code_Kind.PROCEDURE) {
        infer_block_stack.push(node.block);
        node.block.declarations = new Array();
        for (let param of node.parameters) {
            infer(param);
        }
        infer_block_stack.pop();
        infer(node.block);
    }
    else if (node.base.kind == Code_Kind.IF) {
        infer(node.condition);
        infer(node.expression);
    }
    else if (node.base.kind == Code_Kind.ELSE) {
        infer(node.expression);
    }
    else if (node.base.kind == Code_Kind.WHILE) {
        infer(node.condition);
        infer(node.expression);
    }
    else if (node.base.kind == Code_Kind.FOR) {
        if (node.begin) {
            infer(node.begin);
        }
        if (node.condition) {
            infer(node.condition);
        }
        if (node.cycle_end) {
            infer(node.cycle_end);
        }
        infer(node.expression);
    }
    else if (node.base.kind == Code_Kind.CALL) {
        infer(node.ident);
        for (let arg of node.args) {
            infer(arg);
        }
    }
    else if (node.base.kind == Code_Kind.RETURN) {
        infer(node.expression);
    }
    else if (node.base.kind == Code_Kind.IDENT) {
        node.declaration = infer_decl_of_ident(node);
    }
    else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
        infer(node.left);
        infer(node.right);
    }
    return node;
}

function parse(tokens) {
    let token_index = 0;
    // @Todo
    // use enum
    const operator_precedence = {
        ",": 15,
        "=": 14,
        // ternary 13
        "||": 12,
        "&&": 11,
        "|": 10,
        "^": 9,
        "&": 8,
        "==": 7, "!=": 7,
        ">": 6, ">=": 6, "<": 6, "<=": 6,
        "+": 4, "-": 4,
        "*": 3, "/": 3, "%": 3,
    };
    const binary_ops = Object.getOwnPropertyNames(operator_precedence);
    function parse_atom() {
        let curr_token = tokens[token_index];
        if (curr_token.kind == "literal") {
            return parse_literal();
        }
        else if (curr_token.kind == "ident") {
            let left = parse_ident();
            curr_token = tokens[token_index];
            if (curr_token.str == "(") {
                return parse_call(left);
            }
            return left;
        }
        else if (curr_token.str == "(") {
            token_index += 1;
            let ret = parse_expression();
            curr_token = tokens[token_index];
            if (curr_token.str == ")") {
                return ret;
            }
            else {
                debugger;
            }
        }
    }
    function maybe_binary(left, prev_prec) {
        let curr_token = tokens[token_index];
        let curr_prec = operator_precedence[curr_token.str];
        if (curr_prec && prev_prec >= curr_prec) {
            token_index += 1;
            let right = maybe_binary(parse_atom(), curr_prec);
            let binop = make_binary_operation(left, curr_token.str, right);
            return maybe_binary(binop, prev_prec);
        }
        return left;
    }
    function parse_statement() {
        let curr_token = tokens[token_index];
        let next_token = tokens[token_index + 1];
        let second_next_token = tokens[token_index + 2];
        if (curr_token.kind == "ident") {
            if (curr_token.str == "if") {
                return parse_if();
            }
            else if (curr_token.str == "else") {
                return parse_else();
            }
            else if (curr_token.str == "while" && next_token.str == "(") {
                return parse_while();
            }
            else if (curr_token.str == "for" && next_token.str == "(") {
                return parse_for();
            }
            else if (curr_token.str == "continue") {
                return parse_continue();
            }
            else if (curr_token.str == "break") {
                return parse_break();
            }
            else if (curr_token.str == "return") {
                return parse_return();
            }
            else if (next_token.kind == "ident") {
                if (second_next_token.str == "(") {
                    return parse_procedure_declaration();
                }
                else {
                    return parse_declaration();
                }
            }
        }
        else if (curr_token.kind == "punc") {
            if (curr_token.str == "{") {
                return parse_block();
            }
        }
        return parse_expression();
    }
    function parse_expression() {
        let left = parse_atom();
        let curr_token = tokens[token_index];
        if (curr_token.kind == "op") {
            if (curr_token.str == "=") {
                return parse_assign(left);
            }
            else if (binary_ops.indexOf(curr_token.str) >= 0) {
                let maybin = maybe_binary(left, 99);
                return maybin;
            }
            else if (curr_token.str[curr_token.str.length-1] == "=") {
                return parse_opassign(left);
            }
        }
        return left;
    }
    function parse_literal() {
        let curr_token = tokens[token_index];
        token_index += 1;
        return make_literal(parseInt(curr_token.str));
    }
    function parse_call(atom) {
        return make_call(atom, delimited("(", ")", ",", parse_expression));
    }
    function parse_while() {
        token_index += 2;
        let condition = parse_expression();
        let curr_token = tokens[token_index];
        if (curr_token.str == ")") {
            token_index += 1;
        }
        else {
            debugger;
        }
        let block = parse_block();
        return make_while(condition, block);
    }
    function parse_for() {
        token_index += 2;
        let curr_token = tokens[token_index];
        let begin, condition, cycle_end, expression;
        if (curr_token.str != ";") {
            begin = parse_statement();
            curr_token = tokens[token_index];
            if (curr_token.str == ";") {
                token_index += 1;
            }
            else {
                debugger;
            }
        }
        else {
            token_index += 1;
        }
        curr_token = tokens[token_index];
        if (curr_token.str != ";") {
            condition = parse_expression();
            curr_token = tokens[token_index];
            if (curr_token.str == ";") {
                token_index += 1;
            }
            else {
                debugger;
            }
        }
        else {
            token_index += 1;
        }
        curr_token = tokens[token_index];
        if (curr_token.str != ";") {
            cycle_end = parse_statement();
            curr_token = tokens[token_index];
            if (curr_token.str == ")") {
                token_index += 1;
            }
            else {
                debugger;
            }
        }
        expression = parse_statement();
        return make_for(begin, condition, cycle_end, expression);
    }
    function parse_continue() {
        token_index += 1;
        return make_continue();
    }
    function parse_break() {
        token_index += 1;
        return make_break();
    }
    function parse_return() {
        token_index += 1;
        return make_return(parse_expression());
    }
    function parse_ident() {
        let curr_token = tokens[token_index];
        token_index += 1;
        return make_ident(curr_token.str);
    }
    function parse_if() {
        token_index += 2;
        let condition = parse_expression();
        if (tokens[token_index].str == ")") {
            token_index += 1;
        }
        else {
            debugger;
        }
        return make_if(condition, parse_statement());
    }
    function parse_else() {
        token_index += 1;
        return make_else(parse_statement());
    }
    function parse_block() {
        return make_block(delimited("{", "}", ";", parse_statement));
    }
    function parse_assign(left) {
        token_index += 1;
        return make_assign(left, parse_expression());
    }
    function parse_opassign(left) {
        let curr_token = tokens[token_index];
        let op = curr_token.str.slice(0, curr_token.str.length-1);
        token_index += 1;
        let expr = parse_expression();
        return make_opassign(left, op, expr);
    }
    function parse_procedure_declaration() {
        let type = parse_atom();
        let curr_token = tokens[token_index];
        token_index += 1;
        let ident = make_ident(curr_token.str);
        let parameters = delimited("(", ")", ",", parse_declaration);
        let block = parse_block();
        return make_declaration(ident, make_procedure(parameters, type, block));
    }
    function parse_declaration() {
        let idents = new Array();
        while (tokens[token_index].kind == "ident") {
            idents.push(parse_atom());
        }
        let ident = idents.pop();
        let type = idents.shift();
        while (idents.length > 0) {
            ident.name += idents.shift().name;
        }
        let curr_token = tokens[token_index];
        let expression;
        if (curr_token.str == "=") {
            token_index += 1;
            expression = parse_expression();
        }
        return make_declaration(ident, expression, type);
    }
    function delimited(start, stop, separator, elem_func) {
        let elems = [];
        let first = false;
        let curr_token = tokens[token_index];
        if (curr_token.str == start) {
            token_index += 1;
            curr_token = tokens[token_index];
        }
        while (token_index < tokens.length) {
            if (curr_token.str == stop) {
                break;
            };
            if (first) {
                first = false;
            }
            else if (curr_token.str == separator) {
                token_index += 1;
            }
            curr_token = tokens[token_index];
            if (!curr_token || curr_token.str == stop) {
                break;
            };
            let prev_index = token_index;
            elems.push(elem_func());
            if (token_index == prev_index) {
                debugger;
                console.log("parsing error");
                break;
            }
            curr_token = tokens[token_index];
        }
        if (curr_token && curr_token.str == stop) {
            token_index += 1;
        }
        return elems;
    }
    return make_block(delimited("", "", ";", parse_statement));
}

function tokenize(input) {
    let input_index = 0;
    let tokens = new Array();
    function read_token() {
        // skip whitespace
        read_while(is_whitespace);
        if (input_index >= input.length) {
            return null;
        }
        let ch = input[input_index];
        if (input_index + 1 < input.length) {
            let next_ch = input[input_index + 1];
            if (ch == "/") {
                if (next_ch == "/") {
                    // single-line comment
                    read_while(is_not_newline);
                    return null;
                }
                else if (next_ch == "*") {
                    // multi-line comment
                    read_while(is_not_mlc_end);
                    return null;
                }
            }
        }
        if (is_ident_start(ch)) {
            return {
                kind: "ident",
                str: read_while(is_ident_char)
            };
        }
        else if (is_punc(ch)) {
            input_index += 1;
            return {
                kind: "punc",
                str: ch
            };
        }
        else if (is_op_char(ch)) {
            return {
                kind: "op",
                str: read_while(is_op_char)
            };
        }
        else if (is_digit(ch)) {
            return {
                kind: "literal",
                str: read_while(is_digit)
            };
        }
    }

    function read_while(func) {
        let str = "";
        let ch = input[input_index];
        while (func(ch)) {
            str += ch;
            input_index += 1;
            if (input_index >= input.length) {
                break;
            }
            ch = input[input_index];
        }
        return str;
    }

    function is_whitespace(ch) {
        return " \t\r\n".indexOf(ch) >= 0;
    }

    function is_not_newline(ch) {
        return ch != "\n";
    }

    // single lookahead
    function is_not_mlc_end(ch) {
        return !(ch == "*" || input[input_index + 1] == "/");
    }

    function is_punc(ch) {
        return ".,;:(){}[]".indexOf(ch) >= 0;
    }

    function is_ident_start(ch) {
        return /[a-zA-Z_]/.test(ch);
    }

    function is_ident_char(ch) {
        return is_ident_start(ch) || is_digit(ch);
    }

    function is_digit(ch) {
        return /[0-9]/.test(ch);
    }

    function is_op_char(ch) {
        return "+-*/%=&|<>!".indexOf(ch) >= 0;
    }

    while (true) {
        let prev_index = input_index;
        let token = read_token();
        if (input_index == prev_index) {
            debugger;
            console.log("lexing error");
            break;
        }
        if (token) {
            tokens.push(token);
        }
        else if (input_index >= input.length) {
            break;
        }
    }
    return tokens;
}