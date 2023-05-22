const Token_Kind = {
	CHAR_START: "char start",
	CHAR: "char",
	STRING_START: "string start",
	STRING: "string",
	STRING_END: "string end",
	DIGITS: "digits",
	IDENT: "ident",
	OPERATOR: "operator",
	SEMICOLON: "semicolon",
	DELIMITED: "delimited",
	WHITESPACE: "whitespace",
	TAB: "tab",
	NEWLINE: "newline",
	SINGLE_LINE_COMMENT: "single line comment",
	MULTI_LINE_COMMENT: "multi line comment",
};

const Extra_Token_Kind = {
	TYPE: "type",
	KEYWORD: "keyword",
	PROCEDURE: "procedure",
	// nocheckin
	// not used anymore
	RETURN_IDENT: "return ident",
	ESCAPED: "escaped",
};

const File = {
	serial: null,
	text: "",
	name: "(unnamed)",
	token_index: 0,
	tokens: null,
	global_block: null,
};

let files = new Array();
let next_file_serial = 0;
function make_file(text, name = null) {
	let file = Object.assign({}, File);
	file.serial = next_file_serial;
	file.text = text;
	if (name != null) {
		file.name = name;
	}
	files.push(file);
	next_file_serial += 1;
	return file;
}

function parse_text(text) {
	let file = make_file(text);
	parse_file(file);
	return file;
}

function parse_file(file) {
	tokenize(file);
	file.global_block = parse(file);
	return file;
}

const Token = {
	kind: null,
	extra_kind: null,
	code_node: null,	
	serial: null,
	start_index: 0,
	end_index: 0,
	file: null,
	// nocheckin
	// this should be null
	str: "",
};
let next_token_serial = 0;
function make_token(kind, start_index, end_index, text) {
	let token = Object.assign({}, Token);
	token.kind = kind;
	token.start_index = start_index;
	token.end_index = end_index;
	token.str = text.slice(start_index, end_index);
	token.serial = next_token_serial;
	next_token_serial += 1;
	return token;
}

function tokenize(file) {
	let input_index = 0;
	let tokens = new Array();
	while (true) {
		if (input_index >= file.text.length) {
			break;
		}
		let result = read_tokens(file.text, input_index);
		if (result.next_index == input_index) {
			throw Error("tokenize: could not read token");
		}
		input_index = result.next_index;
		for (let token of result.tokens) {
			token.file = file;
			tokens.push(token);
		}
	}
	file.tokens = tokens;
	return file;
}
function read_tokens(input_text, input_index) {
	let start_index = input_index;
	let tokens = new Array();
	if (is_whitespace(input_text, input_index)) {
		input_index = seek_while(is_whitespace, input_text, input_index);
		tokens.push(make_token(Token_Kind.WHITESPACE, start_index, input_index, input_text));
	}
	else if (is_tab(input_text, input_index)) {
		input_index += 1;
		tokens.push(make_token(Token_Kind.TAB, start_index, input_index, input_text));
	}
	else if (is_newline(input_text, input_index)) {
		input_index += 1;
		tokens.push(make_token(Token_Kind.NEWLINE, start_index, input_index, input_text));
	}
	else if (is_carriage_return(input_text, input_index)) {
		input_index += 1;
		if (is_newline(input_text, input_index)) {
			input_index += 1;
		}
		tokens.push(make_token(Token_Kind.NEWLINE, start_index, input_index, input_text));
	}
	else if (is_semicolon(input_text, input_index)) {
		input_index += 1;
		tokens.push(make_token(Token_Kind.SEMICOLON, start_index, input_index, input_text));
	}
	else if (is_slc_start(input_text, input_index)) {
		input_index = seek_until(is_newline, input_text, input_index);
		tokens.push(make_token(Token_Kind.SINGLE_LINE_COMMENT, start_index, input_index, input_text));
	}
	else if (is_mlc_start(input_text, input_index)) {
		// @Incomplete
		// we should track the depth of nested comments
		// to handle things like `/*  /*  */  */`
		input_index = seek_until(is_mlc_end, input_text, input_index);
		input_index += 2;
		tokens.push(make_token(Token_Kind.MULTI_LINE_COMMENT, start_index, input_index, input_text));
	}
	else if (is_delimited(input_text, input_index)) {
		input_index += 1;
		tokens.push(make_token(Token_Kind.DELIMITED, start_index, input_index, input_text));
	}
	else if (is_ident_start(input_text, input_index)) {
		input_index = seek_while(is_ident_char, input_text, input_index);
		tokens.push(make_token(Token_Kind.IDENT, start_index, input_index, input_text));
	}
	else if (is_char_start(input_text, input_index)) {
		tokens.push(make_token(Token_Kind.CHAR_START, start_index, input_index, input_text));
		input_index += 1;
		start_index = input_index;
		tokens.push(make_token(Token_Kind.CHAR, start_index, input_index, input_text));
		input_index += 1;
	}
	else if (is_string_start(input_text, input_index)) {
		tokens.push(make_token(Token_Kind.STRING_START, start_index, input_index, input_text));
		input_index += 1;
		start_index = input_index;
		input_index = seek_until(is_string_end, input_text, input_index);
		tokens.push(make_token(Token_Kind.STRING, start_index, input_index, input_text));
		start_index = input_index;
		input_index += 1;
		tokens.push(make_token(Token_Kind.STRING_END, start_index, input_index, input_text));
	}
	else if (is_declaration_operator(input_text, input_index)) {
		input_index += 1;
		tokens.push(make_token(Token_Kind.OPERATOR, start_index, input_index, input_text));
	}
	else if (is_operator(input_text, input_index)) {
		input_index = seek_while(is_operator, input_text, input_index);
		tokens.push(make_token(Token_Kind.OPERATOR, start_index, input_index, input_text));
	}
	else if (is_digit(input_text, input_index)) {
		input_index = seek_while(is_digit, input_text, input_index);
		tokens.push(make_token(Token_Kind.DIGITS, start_index, input_index, input_text));
	}
	return {tokens: tokens, next_index: input_index};
}
function seek_while(func, input_text, input_index) {
	while (func(input_text, input_index)) {
		input_index += 1;
		if (input_index >= input_text.length) {
			break;
		}
	}
	return input_index;
}
function seek_until(func, input_text, input_index) {
	while (true) {
		input_index += 1;
		if (input_index >= input_text.length) {
			break;
		}
		if (func(input_text, input_index)) {
			break;
		}
	}
	return input_index;
}
function is_whitespace(text, index) {
	return text[index] == " ";
}
function is_tab(text, index) {
	return text[index] == "\t";
}
function is_carriage_return(text, index) {
	return text[index] == "\r";
}
function is_newline(text, index) {
	return text[index] == "\n";
}
function is_semicolon(text, index) {
	return text[index] == ";";
}
function is_mlc_start(text, index) {
	return text[index] == "/" && text[index + 1] == "*";
}
function is_mlc_end(text, index) {
	return text[index] == "*" && text[index + 1] == "/";
}
function is_nested_mlc_start(text, index) {
	return text[index] == "/" && text[index + 1] == "+";
}
function is_nested_mlc_end(text, index) {
	return text[index] == "+" && text[index + 1] == "/";
}
function is_slc_start(text, index) {
	return text[index] == "/" && text[index + 1] == "/";
}
function is_char_start(text, index) {
	return text[index] == "\'";
}
function is_string_start(text, index) {
	return text[index] == "\"";
}
function is_string_end(text, index) {
	return text[index] == "\"";
}
function is_ident_start(text, index) {
	return /[a-zA-Z_]/.test(text[index]);
}
function is_ident_char(text, index) {
	return is_ident_start(text, index) || is_digit(text, index);
}
function is_digit(text, index) {
	return /[0-9]/.test(text[index]);
}
function is_declaration_operator(text, index) {
	return text[index] == ":";
}
function is_operator(text, index) {
	return "+-*/%=&|<>!.,\"\'".indexOf(text[index]) >= 0;
}
function is_delimited(text, index) {
	return "(){}[]".indexOf(text[index]) >= 0;
}