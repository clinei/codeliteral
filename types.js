const Type_Kind = {
	INTEGER: "integer",
	FLOAT: "float",
	BOOL: "bool",
	ENUM: "enum",
	CHAR: "char",
	ARRAY: "array",
	STRUCT: "struct",
	STRING: "string",
	POINTER: "pointer",
	VOID: "void",
	NULL: "null",
};
const Type_Info = {
	kind: null,
	serial: null,
	size_in_bytes: null,
};
const Type_Info_Integer = {
	base: null,
	signed: null,
};
const Type_Info_Float = {
	base: null,
};
const Type_Info_Bool = {
	base: null,
};
const Type_Info_Enum = {
	base: null,
	elem_type: null,
	is_flags: false,
};
const Type_Info_Char = {
	base: null,
};
const Type_Info_Array = {
	base: null,
	elem_type: null,
	size: null,
};
const Type_Info_Struct = {
	base: null,
	members: null,
	offsets_may_not_match: false,
};
const Type_Info_String = {
	base: null,
};
const Type_Info_Pointer = {
	base: null,
	elem_type: null,
};
const Type_Info_Procedure = {
	base: null,
	parameter_types: null,
	return_types: null,
};
const Type_Info_Void = {
	base: null,
};
const Type_Info_Null = {
	base: null,
};

let next_type_info_serial = 0;
function make_type_info() {
	let info = Object.assign({}, Type_Info);
	info.serial = next_type_info_serial;
	next_type_info_serial += 1;
	return info;
}
function make_type_info_integer(size_in_bytes, signed) {
	let info = Object.assign({}, Type_Info_Integer);
	info.base = make_type_info();
	info.base.kind = Type_Kind.INTEGER;

	info.base.size_in_bytes = size_in_bytes;
	info.signed = signed;

	return info;
}
function make_type_info_float(size_in_bytes) {
	let info = Object.assign({}, Type_Info_Float);
	info.base = make_type_info();
	info.base.kind = Type_Kind.FLOAT;

	info.base.size_in_bytes = size_in_bytes;
	
	return info;
}
function make_type_info_bool() {
	let info = Object.assign({}, Type_Info_Bool);
	info.base = make_type_info();
	info.base.kind = Type_Kind.BOOL;

	info.base.size_in_bytes = 1;

	return info;
}
function make_type_info_enum(elem_type) {
	let info = Object.assign({}, Type_Info_Enum);
	info.base = make_type_info();
	info.base.kind = Type_Kind.ENUM;

	info.elem_type = elem_type;
	info.base.size_in_bytes = elem_type.base.size_in_bytes;
	
	return info;
}
function make_type_info_char() {
	let info = Object.assign({}, Type_Info_Char);
	info.base = make_type_info();
	info.base.kind = Type_Kind.CHAR;

	info.base.size_in_bytes = 1;

	return info;
}
function make_type_info_array(elem_type, size) {
	let info = Object.assign({}, Type_Info_Array);
	info.base = make_type_info();
	info.base.kind = Type_Kind.ARRAY;

	info.elem_type = elem_type;
	info.size = size;
	info.base.size_in_bytes = elem_type.base.size_in_bytes * size;

	return info;
}
function make_type_info_struct_dummy() {
	let info = Object.assign({}, Type_Info_Struct);
	info.base = make_type_info();
	info.base.kind = Type_Kind.STRUCT;
	info.members = new Object();
	return info;
}
function fill_type_info_struct(node) {
	let info = node.base.type;
	let members = info.members;
	let size_in_bytes = 0;
	for (let stmt of node.block.delimited.elements) {
		if (stmt.expression == null) {
			continue;
		}
		let expression = stmt.expression;
		if (expression.base.kind == Code_Kind.DECLARATION) {
			let member = new Object();
			member.offset = size_in_bytes;
			member.type = expression.ident.base.type;
			members[expression.ident.name] = member;
			size_in_bytes += member.type.base.size_in_bytes;
		}
		else {
			throw Error("Only declarations are allowed in struct definitions");
		}
	}
	info.base.size_in_bytes = size_in_bytes;
	return info;
}
function make_type_info_struct(node) {
	node.base.type = make_type_info_struct_dummy();
	return fill_type_info_struct(node);
}
function make_type_info_struct_literal(node) {
	node.base.type = make_type_info_struct_dummy();
	let info = node.base.type;
	let members = info.members;
	let names = Object.keys(node.value);
	let size_in_bytes = 0;
	for (let name of names) {
		let value = node.value[name];
		let member = new Object();
		member.offset = size_in_bytes;
		member.type = value.base.type;
		members[name] = member;
		size_in_bytes += member.type.base.size_in_bytes;
	}
	info.base.size_in_bytes = size_in_bytes;
	info.offsets_may_not_match = true;
	return info;
}
function make_type_info_string() {
	let info = Object.assign({}, Type_Info_String);
	info.base = make_type_info();
	info.base.kind = Type_Kind.STRING;
	
	return info;
}
function make_type_info_pointer(elem_type) {
	let info = Object.assign({}, Type_Info_Pointer);
	info.base = make_type_info();
	info.base.kind = Type_Kind.POINTER;

	info.elem_type = elem_type;
	info.base.size_in_bytes = primitive_type_infos.size_t.base.size_in_bytes;

	return info;
}
function make_type_info_procedure(parameter_types, return_types) {
	let info = Object.assign({}, Type_Info_Procedure);
	info.base = make_type_info();
	info.base.kind = Type_Kind.PROCEDURE;

	info.parameter_types = parameter_types;
	info.return_types = return_types;
	info.base.size_in_bytes = NaN;

	return info;
}
function make_type_info_void() {
	let info = Object.assign({}, Type_Info_Void);
	info.base = make_type_info();
	info.base.kind = Type_Kind.VOID;
	info.base.size_in_bytes = NaN;
	return info;
}
function make_type_info_null() {
	let info = Object.assign({}, Type_Info_Null);
	info.base = make_type_info();
	info.base.kind = Type_Kind.NULL;
	info.base.size_in_bytes = NaN;
	return info;
}

const global_type_scope = make_scope();
const primitive_type_infos = {
	"int": make_type_info_integer(4, true),
	"float": make_type_info_float(4),
	"bool": make_type_info_bool(),
	"char": make_type_info_char(),
	// "string": make_type_info_struct(),
	"void": make_type_info_void(),
	"size_t": make_type_info_integer(4, false),
};
const Types = {
	"int": make_ident("int"),
	"float": make_ident("float"),
	"bool": make_ident("bool"),
	"char": make_ident("char"),
	"string": make_ident("string"),
	"void": make_ident("void"),
	"size_t": make_ident("size_t"),
}
const primitive_type_decls = {
	"int": make_declaration(Types["int"]),
	"float": make_declaration(Types["float"]),
	"bool": make_declaration(Types["bool"]),
	"char": make_declaration(Types["char"]),
	"string": make_declaration(Types["string"]),
	"void": make_declaration(Types["void"]),
	"size_t": make_declaration(Types["size_t"]),
}
function init_types() {
	let primitive_type_names = Object.keys(primitive_type_infos);
	for (let type_name of primitive_type_names) {
		let type_decl = primitive_type_decls[type_name];
		let type_info = primitive_type_infos[type_name];
		type_decl.ident.base.type = type_info;
		type_decl.ident.base.enclosing_scope = global_type_scope;
		type_decl.base.enclosing_scope = global_type_scope;
		type_decl.ident.tokens[0].extra_kind = Extra_Token_Kind.TYPE;
	}
}
init_types();
let User_Types = {};

function make_node_from_type(type) {
	let node;
	if (type.base.kind == Type_Kind.INTEGER) {
		node = make_integer();
	}
	else if (type.base.kind == Type_Kind.FLOAT) {
		node = make_float();
	}
	else if (type.base.kind == Type_Kind.BOOL) {
		node = make_bool();
	}
	else if (type.base.kind == Type_Kind.CHAR) {
		node = make_char();
	}
	else if (type.base.kind == Type_Kind.ENUM) {
		const left = make_ident("enum");
		const right = make_ident("member");
		left.base.type = type;
		node = make_dot_operator(left, right);
		node.base.run_silent = true;
	}
	else if (type.base.kind == Type_Kind.POINTER) {
		node = make_integer();
	}
	else if (type.base.kind == Type_Kind.ARRAY) {
		node = make_array_literal();
	}
	else if (type.base.kind == Type_Kind.STRUCT) {
		node = make_struct_literal();
	}
	else {
		throw Error("Trying to create a node from an invalid type");
	}
	// @Incomplete
	// can't infer enum types well
	// node.base.type = infer_type(node);
	node.base.type = type;
	let types_match = check_that_types_match(node.base.type, type);
	if (types_match == false) {
		// :Next
		// throw Error;
	}
	return node;
}

function check_that_types_match(left, right) {
	// left is authoritative
	if (left.base.size_in_bytes != right.base.size_in_bytes) {
		return false;
	}
	if (left.base.kind != right.base.kind) {
		return false;
	}
	if (left.base.kind == Type_Kind.INTEGER) {
		if (left.signed == right.signed) {
			return true;
		}
		else {
			return false;
		}
	}
	else if (left.base.kind == Type_Kind.FLOAT) {
		// size_in_bytes and kind have already been checked
		// so there is nothing else to do
		return true;
	}
	else if (left.base.kind == Type_Kind.BOOL) {
		// size_in_bytes and kind have already been checked
		// so there is nothing else to do
		return true;
	}
	else if (left.base.kind == Type_Kind.CHAR) {
		// size_in_bytes and kind have already been checked
		// so there is nothing else to do
		// :SignedMismatch
		return true;
	}
	else if (left.base.kind == Type_Kind.ENUM) {
		if (Object.is(left, right)) {
			return true;
		}
		else {
			return false;
		}
	}
	else if (left.base.kind == Type_Kind.POINTER) {
		return check_that_types_match(left.elem_type, right.elem_type);
	}
	else if (left.base.kind == Type_Kind.ARRAY) {
		// :DynamicArray
		if (left.size != right.size) {
			return false;
		}
		return check_that_types_match(left.elem_type, right.elem_type);
	}
	else if (left.base.kind == Type_Kind.STRUCT) {
		let left_names = Object.keys(left.members);
		let right_names = Object.keys(right.members);
		if (left_names.length != right_names.length) {
			return false;
		}
		for (let left_name of left_names) {
			if (left_name in right.members == false) {
				return false;
			}
			let left_member = left.members[left_name];
			let right_member = right.members[left_name];
			if (left_member.offset != right_member.offset && right.offsets_may_not_match == false) {
				return false;
			}
			let types_match = check_that_types_match(left_member.type, right_member.type);
			if (types_match == false) {
				return false;
			}
		}
	}
	else {
		throw Error("check_that_types_match: unknown Type_Kind");
	}
	return true;
}