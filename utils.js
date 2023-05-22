const Color_RGBA = {
	r: 0,
	g: 0,
	b: 0,
	a: 0,
};
function make_color_rgba(r, g, b, a) {
	let color = Object.assign({}, Color_RGBA);
	color.r = r;
	color.g = g;
	color.b = b;
	color.a = a;
	return color;
}
function convert_color_rgba_to_css(color) {
	return convert_rgba_to_css(color.r, color.g, color.b, color.a);
}
function convert_rgba_to_css(r, g, b, a) {
	return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}

function set_data_breakpoint(obj, property_name) {
	obj["_" + property_name] = obj[property_name];
	Object.defineProperty(obj, property_name, {
		get: function() {
			return obj["_" + property_name];
		},
		set: function(value) {
			debugger;
			obj["_" + property_name] = value;
		}
	});
}

function set_data_breakpoint_value(obj, property_name, target_value) {
	obj["_" + property_name] = obj[property_name];
	Object.defineProperty(obj, property_name, {
		get: function() {
			return obj["_" + property_name];
		},
		set: function(value) {
			if (value === target_value) {
				debugger;
			}
			obj["_" + property_name] = value;
		}
	});
}

function clone(node) {
	let cloned = null;
	if (node == null) {
		return null;
	}
	if (node.base.kind == Code_Kind.BLOCK) {
		cloned = make_block();
		// nocheckin
		// @Audit
		// the order is important here
		node.clone = cloned;
		// do not change it into this:
		// node.base.clone = cloned;
		cloned.delimited = clone(node.delimited);
		// nocheckin
		// this can probably be removed
		cloned.statements = cloned.delimited.elements;
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {
		let cloned_expression = null;
		if (node.expression != null) {
			cloned_expression = clone(node.expression);
		}
		cloned = make_statement(cloned_expression);
		cloned.needs_semicolon = node.needs_semicolon;
		// :crr
		// nocheckin
		// somehow, statement.should_indent is lost
		// maybe in the infer state?
		cloned.should_indent = node.should_indent;
	}
	else if (node.base.kind == Code_Kind.DELIMITED) {
		let cloned_elements = new Array();
		for (let elem of node.elements) {
			cloned_elements.push(clone(elem));
		}
		cloned = make_delimited(cloned_elements, clone(node.begin), clone(node.separator), clone(node.end));
	}
	else if (node.base.kind == Code_Kind.OPERATOR) {
		cloned = make_operator(node.str);
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
		cloned = make_procedure(clone(node.parameters), clone(node.returns), clone(node.block));
	}
	else if (node.base.kind == Code_Kind.STRUCT_DEFINITION) {
		cloned = make_struct_definition(clone(node.block));
	}
	else if (node.base.kind == Code_Kind.ENUM_DEFINITION) {
		cloned = make_struct_definition(clone(node.block));
		cloned.is_flags = node.is_flags;
	}
	else if (node.base.kind == Code_Kind.CALL) {
		cloned = make_call(clone(node.procedure), clone(node.args));
	}
	else if (node.base.kind == Code_Kind.SYSCALL) {
		let params = null;
		if (node.parameters) {
			params = new Array();
			for (let param of node.parameters) {
				params.push(clone(param));
			}
		}
		let returns = null;
		if (node.returns) {
			returns = new Array();
			for (let retn of node.returns) {
				returns.push(clone(retn));
			}
		}
		cloned = make_syscall(node.id, params, returns);
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		let cloned_delimited = clone(node.delimited);
		cloned = make_array_index(clone(node.target), cloned_delimited.first_element, cloned_delimited);
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		cloned = make_dot_operator(clone(node.left), clone(node.right));
	}
	else if (node.base.kind == Code_Kind.KEYWORD) {
		cloned = make_keyword(node.str);
	}
	else if (node.base.kind == Code_Kind.IF) {
		cloned = make_if(clone(node.condition), clone(node.statement), clone(node.keyword), clone(node.then_keyword));
	}
	else if (node.base.kind == Code_Kind.ELSE) {
		cloned = make_else(clone(node.statement), clone(node.keyword));
	}
	else if (node.base.kind == Code_Kind.WHILE) {
		cloned = make_while(clone(node.condition), clone(node.statement), clone(node.keyword));
	}
	else if (node.base.kind == Code_Kind.FOR) {
		cloned = make_for(clone(node.set), clone(node.statement), clone(node.keyword));
	}
	else if (node.base.kind == Code_Kind.INTEGER_SET) {
		cloned = make_integer_set(clone(node.begin_it), clone(node.end_it), clone(node.operator));
	}
	else if (node.base.kind == Code_Kind.BREAK) {
		cloned = make_break(clone(node.keyword));
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {
		cloned = make_continue(clone(node.keyword));
	}
	else if (node.base.kind == Code_Kind.RETURN) {
		cloned = make_return(clone(node.expression), clone(node.keyword));
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {
		cloned = make_declaration(clone(node.ident), clone(node.type), clone(node.expression), clone(node.type_operator), clone(node.expression_operator));
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		let ident = make_ident(node.name, node.tokens);
		// nocheckin
		// node.declaration is fixed up in infer
		/*
		if (node.declaration != null) {
			ident.declaration = node.declaration;
			if (ident.declaration.clone != null) {
				ident.declaration = ident.declaration.clone;
			}
		}
		*/
		cloned = ident;
	}
	else if (node.base.kind == Code_Kind.MINUS) {
		cloned = make_minus(clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.NOT) {
		cloned = make_not(clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		cloned = make_increment(clone(node.target));
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		cloned = make_decrement(clone(node.target), clone(node.operator));
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		cloned = make_assign(clone(node.target), clone(node.expression), clone(node.operator));
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {
		cloned = make_opassign(clone(node.target), clone(node.expression), clone(node.operator));
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		cloned = make_parens(null, clone(node.delimited));
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		cloned = make_binary_operation(clone(node.left), clone(node.operator), clone(node.right));
	}
	else if (node.base.kind == Code_Kind.INTEGER) {
		cloned = make_integer(node.value);
	}
	else if (node.base.kind == Code_Kind.FLOAT) {
		cloned = make_float(node.value);
	}
	else if (node.base.kind == Code_Kind.BOOL) {
		cloned = make_bool(node.value);
	}
	else if (node.base.kind == Code_Kind.CHAR) {
		cloned = make_char(node.value);
	}
	else if (node.base.kind == Code_Kind.STRUCT_LITERAL) {
		cloned = make_struct_literal(node.type, clone(node.delimited));
	}
	else if (node.base.kind == Code_Kind.ARRAY_LITERAL) {
		cloned = make_array_literal(node.type, clone(node.delimited));
	}
	else if (node.base.kind == Code_Kind.STRING) {
		cloned = make_string(node.str);
		cloned.value = node.value;
		// @Cleanup
		// nocheckin
		// cloned.pointer = node.pointer;
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {
		cloned = make_reference(clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		cloned = make_dereference(clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.CAST) {
		cloned = make_cast(node.target_type, clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.POINTER_TYPE) {
		cloned = make_pointer_type(clone(node.elem_type), clone(node.operator));
	}
	else if (node.base.kind == Code_Kind.ARRAY_TYPE) {
		cloned = make_array_type(clone(node.size), clone(node.elem_type), clone(node.begin_operator), clone(node.end_operator));
	}
	cloned.base.clone_of = node;
	node.base.clone = cloned;
	if (node.base.enclosing_scope != null && node.base.enclosing_scope.base.clone != null) {
		cloned.base.enclosing_scope = node.base.enclosing_scope.base.clone;
	}
	else {
		cloned.base.enclosing_scope = node.base.enclosing_scope;
	}
	cloned.base.type = node.base.type;
	cloned.base.file = node.base.file;
	cloned.base.token_begin = node.base.token_begin;
	cloned.base.token_end = node.base.token_end;
	cloned.base.needs_semicolon_in_statement = node.base.needs_semicolon_in_statement;
	cloned.base.run_silent = node.base.run_silent;
	cloned.base.run_disable = node.base.run_disable;
	cloned.base.was_generated = node.base.was_generated;
	cloned.base.generated_from = node.base.generated_from;
	return cloned;
}
function get_original(node) {
	if (node == null) {
		return null;
	}
	let curr = node;
	if (curr.base.generated_from != null) {
		curr = curr.base.generated_from;
	}
	while (curr.base.clone_of != null) {
		curr = curr.base.clone_of;
	}
	return curr;
}

function get_tokens_from_file(begin, end, file) {
	if (typeof begin != "number") {
		throw Error("get_tokens_from_file: begin is not a number");
	}
	if (typeof end != "number") {
		throw Error("get_tokens_from_file: end is not a number");
	}
	if (file == null) {
		throw Error("get_tokens_from_file: file is null");
	}
	if (begin > file.tokens.length) {
		throw Error("get_tokens_from_file: begin is bigger than the number of tokens in the file (was: '" + start + "', max: '" + file.tokens.length-1 + "')");
	}
	if (end > file.tokens.length) {
		throw Error("get_tokens_from_file: end is bigger than the number of tokens in the file (was: '" + end + "', max: '" + file.tokens.length-1 + "')");
	}
	return file.tokens.slice(begin, end);
}
function get_tokens_from_file_between(left, right) {
	if (left.base.file == null) {
		throw Error("get_tokens_from_file_between: left has no file");
	}
	if (right.base.file == null) {
		throw Error("get_tokens_from_file_between: right has no file");
	}
	if (left.base.file != right.base.file) {
		throw Error("get_tokens_from_file_between: left and right are from different files");
	}
	if (left.base.token_begin == 0 && left.base.token_end == 0) {
		return new Array();
	}
	if (right.base.token_begin == 0 && right.base.token_end == 0) {
		return new Array();
	}
	return get_tokens_from_file(left.base.token_end, right.base.token_begin, left.base.file);
}