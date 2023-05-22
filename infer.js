function infer(node) {
	infer_was_generated(node);
	infer_enclosing_scope(node);
	infer_run_disable(node);
	if (node == null) {
		return;
	}
	if (node.base.kind == Code_Kind.SCOPE) {
		let curr_scope = node;
		while (curr_scope != null) {
			if (curr_scope.block != null) {
				node.block = curr_scope.block;
				break;
			}
			curr_scope = curr_scope.base.enclosing_scope;
		}
	}
	else if (node.base.kind == Code_Kind.DELIMITED) {
		infer(node.scope);
		infer(node.begin);
		infer(node.separator);
		update_delimited(node);
		for (let i = 0; i < node.elements.length; i += 1) {
			let elem = node.elements[i];
			infer(elem);
		}
		if (node.separator != null) {
			for (let separator of node.all_separators) {
				infer(separator);
			}
		}
		infer(node.end);
		infer_push_scope(node.scope);
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {
		if (node.expression != null) {
			infer(node.expression);
		}
	}
	else if (node.base.kind == Code_Kind.BLOCK) {
		node.delimited.scope.block = node;
		infer(node.delimited);
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {
		const prev_decl = infer_decl_of_name(node.ident.name, node.base.enclosing_scope);
		if (prev_decl) {
			// @Incomplete
			// nocheckin
			// maybe this is fixed now
			// this breaks loops, something about the way for_scope works
			// throw Error("identifier \"" + node.ident.name + "\" already declared in the current scope");
		}
		node.base.enclosing_scope.declarations.push(node);
		infer(node.type_operator);
		infer(node.type);
		infer(node.expression_operator);
		if (node.expression != null) {
			if (node.expression.base.kind == Code_Kind.STRUCT_DEFINITION) {
				// implicit declaration so we can refer to the type inside the struct
				// when the struct type itself has not been declared yet
				let dummy = make_type_info_struct_dummy();
				node.expression.base.type = dummy;
				node.ident.base.type = dummy;
			}
			if (node.expression.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
				node.ident.tokens[0].extra_kind = Extra_Token_Kind.PROCEDURE;
				node.expression.scope.base.enclosing_scope = node.base.enclosing_scope;
			}
			infer(node.expression);
			if (node.expression.base.kind == Code_Kind.ENUM_DEFINITION) {
				// :TypeInfo
				node.expression.base.type.enum_name = node.ident.name;
				node.ident.base.type = node.expression.base.type;
			}
			node.ident.base.type = node.expression.base.type;
		}
		if (node.type != null) {
			node.ident.base.type = infer_type(node.type);
		}
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		if (node.declaration == null) {
			node.declaration = infer_decl_of_name(node.name, node.base.enclosing_scope);
		}
		if (node.declaration == null) {
			throw Error("Could not find declaration of ident '" + node.name + "', make sure it's declared before it is used");
		}
		node.tokens[0].extra_kind = node.declaration.ident.tokens[0].extra_kind;
		node.base.type = infer_type(node);
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		infer(node.target);
		infer(node.operator);
		infer(node.expression);
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {
		infer(node.target);
		infer(node.operator);
		infer(node.expression);
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		infer(node.delimited);
		if (node.expression != null) {
			infer(node.expression);
			node.base.type = node.expression.base.type;
		}
	}
	else if (node.base.kind == Code_Kind.OPERATOR) {
		// nothing to do here
	}
	else if (node.base.kind == Code_Kind.MINUS) {
		infer(node.expression);
		node.base.type = infer_type(node);
	}
	else if (node.base.kind == Code_Kind.NOT) {
		infer(node.expression);
		node.base.type = infer_type(node);
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		infer(node.target);
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		infer(node.target);
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		infer(node.target);
		infer(node.delimited);
		infer(node.index);
		node.base.type = node.target.base.type.elem_type;
		// nocheckin
		/*
		if (node.target.base.type == primitive_type_infos.string) {
			node.base.type = primitive_type_infos.string.members.pointer.type.elem_type;
		}
		else {
			node.base.type = node.target.base.type.elem_type;
		}
		*/
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		let left = node.left;
		let right = node.right;
		while (true) {
			left.base.is_lhs = node.base.is_lhs;
			right.base.is_lhs = node.base.is_lhs;
			infer(left);
			if (right.base.kind == Code_Kind.DOT_OPERATOR) {
				right.base.type = left.base.type.members[right.left.name].type;
				left = right.left;
				right = right.right;
			}
			else if (left.base.type.base.kind == Type_Kind.ARRAY) {
				if (right.name == "count") {
					right.base.type = primitive_type_infos.size_t;
				}
				else {
					throw Error;
				}
				break;
			}
			else if (right.base.kind == Code_Kind.IDENT) {
				if (left.base.type.base.kind == Type_Kind.ENUM) {
					right.base.type = left.base.type;
				}
				else if (left.base.type.base.kind == Type_Kind.STRUCT) {
					right.base.type = left.base.type.members[right.name].type;
				}
				else if (left.base.type.base.kind == Type_Kind.POINTER) {
					if (left.base.type.elem_type.base.kind == Type_Kind.STRUCT) {
						right.base.type = left.base.type.elem_type.members[right.name].type;
					}
					else {
						throw Error;
					}
				}
				else {
					throw Error("Unhandled dot operator type");
				}
				break;
			}
		}
		node.base.type = right.base.type;
	}
	else if (node.base.kind == Code_Kind.INTEGER) {
		node.base.type = primitive_type_infos.int;
		// @Incomplete
		// need to choose size based on value
		/*
		if (node.value < 0 ) {
			node.base.type = primitive_type_infos.int;
		}
		else {
			node.base.type = primitive_type_infos.size_t;
		}
		*/
	}
	else if (node.base.kind == Code_Kind.FLOAT) {
		// @Incomplete
		// need to choose size based on value
		node.base.type = primitive_type_infos.float;
	}
	else if (node.base.kind == Code_Kind.BOOL) {
		// @Incomplete
		node.base.type = primitive_type_infos.bool;
	}
	else if (node.base.kind == Code_Kind.CHAR) {
		// @Incomplete
		node.base.type = primitive_type_infos.char;
	}
	else if (node.base.kind == Code_Kind.STRING) {
		node.base.type = primitive_type_infos.string;
	}
	else if (node.base.kind == Code_Kind.ARRAY_LITERAL) {
		infer(node.delimited);
		node.base.type = infer_type(node);
	}
	else if (node.base.kind == Code_Kind.STRUCT_LITERAL) {
		node.base.type = infer_type(node);
	}
	else if (node.base.kind == Code_Kind.ENUM_DEFINITION) {
		node.base.run_disable = true;
		infer_enum_values(node);
		node.base.type = infer_type(node);
	}
	else if (node.base.kind == Code_Kind.STRUCT_DEFINITION) {
		node.base.run_disable = true;
		// @Incomplete
		// The type of a Type is Type
		// :TypeInfo
		// node.base.type = infer_type(node);
		infer(node.block);
		fill_type_info_struct(node);
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
		node.scope.belongs_to = node;
		infer(node.scope);
		if (node.parameters != null) {
			node.parameters.base.enclosing_scope = node.scope;
			node.parameters.scope.base.enclosing_scope = node.scope;
			node.parameters.scope.is_implicit = true;
			infer(node.parameters);
		}
		infer(node.operator);
		if (node.returns != null) {
			node.returns.base.enclosing_scope = node.scope;
			node.returns.scope.base.enclosing_scope = node.scope;
			node.returns.scope.is_implicit = true;
			infer(node.returns);
		}
		// nocheckin
		// @Incomplete
		// not all control paths return a value
		node.return_statements = new Array();
		node.block.base.enclosing_scope = node.scope;
		infer(node.block);
		for (let i = 0; i < node.return_statements.length; i += 1) {
			let retn_stmt = node.return_statements[i];
			if (retn_stmt.expression != null) {
				if (node.returns == null) {
					throw Error("infer: procedure definition with no returns has a return statement with an expression");
				}
			}
		}
		node.base.run_disable = true;
		node.base.type = infer_type(node);
	}
	else if (node.base.kind == Code_Kind.KEYWORD) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.IF) {
		infer(node.keyword);
		infer(node.condition);
		infer(node.statement);
		if (node.statement != null && node.statement.expression != null) {
			node.statement.should_indent = false;
		}
		node.base.enclosing_scope.block.prev_if_stmt = node;
	}
	else if (node.base.kind == Code_Kind.ELSE) {
		if (node.base.enclosing_scope.block.prev_if_stmt == null) {
			throw Error("infer: expected if before else");
		}
		node.if_stmt = node.base.enclosing_scope.block.prev_if_stmt;
		node.if_stmt.else_stmt = node;
		node.base.enclosing_scope.block.prev_if_stmt = null;
		infer(node.keyword);
		if (node.statement != null) {
			infer(node.statement);
		}
	}
	else if (node.base.kind == Code_Kind.WHILE) {
		infer(node.keyword);
		infer(node.condition);
		infer(node.statement);
	}
	else if (node.base.kind == Code_Kind.FOR) {
		infer(node.keyword);
		infer(node.set);
		node.block = make_block();
		node.block.base.was_generated = true;
		node.block.delimited.base.was_generated = true;
		node.block.delimited.is_implicit = true;
		if (node.set.base.kind != Code_Kind.INTEGER_SET) {
			throw Error("infer: only integer sets are supported in for loops");
		}
		// loop variable declarations
		let it_index_ident = make_ident("it_index");
		let it_index_type = Types.int;
		let it_index_type_operator = make_operator(":");
		let it_index_expression = clone(node.set.begin_it);
		it_index_expression.base.clone_of = null;
		let it_index_expression_operator = make_operator("=");
		let it_index_decl = make_declaration(it_index_ident, it_index_type, it_index_expression, it_index_type_operator, it_index_expression_operator);
		it_index_decl.base.was_generated = true;
		let it_index_decl_stmt = make_statement(it_index_decl);
		it_index_decl_stmt.base.was_generated = true;
		it_index_decl_stmt.base.enclosing_scope = node.scope;
		let it_ident = make_ident("it");
		let it_type = Types.int;
		let it_type_operator = make_operator(":");
		let it_expression = clone(it_index_ident);
		it_expression.base.clone_of = null;
		let it_expression_operator = make_operator("=");
		let it_decl = make_declaration(it_ident, it_type, it_expression, it_type_operator, it_expression_operator);
		it_decl.base.was_generated = true;
		let it_decl_stmt = make_statement(it_decl);
		it_decl_stmt.base.was_generated = true;
		it_decl_stmt.base.enclosing_scope = node.scope;
		// init block
		node.block.delimited.elements.push(it_index_decl_stmt);
		node.block.delimited.elements.push(it_decl_stmt);
		node.block.base.enclosing_scope = node.scope;
		node.block.delimited.scope.is_implicit = true;
		infer(node.block);
		let condition_it_index_ident = clone(it_index_ident);
		condition_it_index_ident.base.clone_of = null;
		let condition_operator = make_operator("<=");
		let condition_end = clone(node.set.end_it);
		condition_end.base.clone_of = null;
		node.condition = make_binary_operation(condition_it_index_ident, condition_operator, condition_end);
		node.condition.base.was_generated = true;
		node.condition.base.enclosing_scope = node.scope;
		infer(node.condition);
		let it_assign_target = clone(it_ident);
		it_assign_target.base.clone_of = null;
		let it_assign_expression = clone(it_index_ident);
		it_assign_expression.base.clone_of = null;
		let it_assign = make_assign(it_assign_target, it_assign_expression);
		it_assign.base.was_generated = true;
		let it_assign_stmt = make_statement(it_assign);
		it_assign_stmt.base.was_generated = true;
		it_assign_stmt.base.enclosing_scope = node.scope;
		node.it_assign = it_assign_stmt;
		infer(node.it_assign);
		let it_index_assign_target = clone(it_index_ident);
		it_index_assign_target.base.clone_of = null;
		let it_index_ident_binop = clone(it_index_ident);
		it_index_ident_binop.base.clone_of = null;
		let operator = make_operator("+");
		let it_index_change = make_integer(1);
		let binop = make_binary_operation(it_index_ident_binop, operator, it_index_change);
		binop.base.was_generated = true;
		let it_index_assign = make_assign(it_index_assign_target, binop);
		it_index_assign.base.was_generated = true;
		let it_index_assign_stmt = make_statement(it_index_assign);
		it_index_assign_stmt.base.was_generated = true;
		it_index_assign_stmt.base.enclosing_scope = node.scope;
		node.it_index_assign = it_index_assign_stmt;
		infer(node.it_index_assign);
		infer(node.scope);
		node.statement.base.enclosing_scope = node.scope;
		infer(node.statement);
	}
	else if (node.base.kind == Code_Kind.INTEGER_SET) {
		infer(node.begin_it);
		infer(node.separator);
		infer(node.end_it);
	}
	else if (node.base.kind == Code_Kind.BREAK) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.RETURN) {
		let last_procedure_definition = find_procedure_definition(node);
		last_procedure_definition.return_statements.push(node);
		infer(node.expression);
	}
	else if (node.base.kind == Code_Kind.CALL) {
		infer(node.procedure);
		node.args.scope.is_argument_scope = true;
		infer(node.args);
		// nocheckin
		// @Incomplete
		// we could call arbitrary expressions
		// so how should we handle declarations?
		// put it in node.base?
		// @Incomplete
		// nocheckin
		// we should check that the number of arguments and parameters match
		if (node.procedure.declaration.expression.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
			let proc_decl = node.procedure.declaration;
			if (proc_decl.expression.returns != null) {
				let retn = proc_decl.expression.returns.elements[0];
				if (retn.base.kind == Code_Kind.IDENT) {
					node.base.type = infer_type(retn);
				}
				else if (retn.base.kind == Code_Kind.DECLARATION) {
					node.base.type = retn.ident.base.type;
				}
			}
			else {
				node.base.type = primitive_type_infos.void;
			}
		}
		else if (node.procedure.declaration.expression.base.kind == Code_Kind.SYSCALL) {
			if (node.procedure.declaration.expression.returns.length > 0) {
				// :MultipleReturns
				node.base.type = node.procedure.declaration.expression.returns.elements[0].base.type;
			}
			else {
				node.base.type = primitive_type_infos.void;
			}
		}
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {
		node.base.type = infer_type(node);
		infer(node.expression);
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		node.base.type = infer_type(node);
		infer(node.expression);
	}
	else if (node.base.kind == Code_Kind.CAST) {
		infer(node.target_type);
		node.base.type = infer_type(node);
		infer(node.expression);
		if (node.base.type.base.kind == Type_Kind.INTEGER) {
			if (node.expression.base.type.base.kind == Type_Kind.FLOAT) {
				console.log("Warning: casting float to int");
			}
		}
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		infer(node.left);
		infer(node.operator);
		infer(node.right);
		node.base.type = infer_type(node);
	}
	else if (node.base.kind == Code_Kind.SYSCALL) {
		node.base.type = infer_type(node);
		node.base.run_disable = true;
	}
	else if (node.base.kind == Code_Kind.POINTER_TYPE) {
		// :TypeInfo
		// the type of a type is Type
		// node.base.type = infer_type(node);
		// node.base.run_disable = true;
	}
	else if (node.base.kind == Code_Kind.ARRAY_TYPE) {
		// :TypeInfo
		// the type of a type is Type
		// node.base.type = infer_type(node);
		// node.base.run_disable = true;
	}
	else {
		throw Error("infer: unknown Code_Kind: '" + node.base.kind + "'");
	}
	return node;
}
function infer_was_generated(node) {
	if (node == null) {
		return;
	}
	if (node.base.kind == Code_Kind.SCOPE) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.DELIMITED) {
		node.scope.base.was_generated = node.base.was_generated;
		if (node.begin != null) {
			node.begin.base.was_generated = node.base.was_generated;
		}
		if (node.separator != null) {
			node.separator.base.was_generated = node.base.was_generated;
		}
		for (let separator of node.all_separators) {
			// nocheckin
			// why do we need null separators?
			// we could just check if node.separator is null
			if (separator != null) {
				separator.base.was_generated = node.base.was_generated;			
			}
		}
		if (node.end != null) {
			node.end.base.was_generated = node.base.was_generated;
		}
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {
		if (node.expression != null) {
			node.expression.base.was_generated = node.base.was_generated;
		}
	}
	else if (node.base.kind == Code_Kind.BLOCK) {
		node.delimited.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {
		node.ident.base.was_generated = node.base.was_generated;
		node.type_operator.base.was_generated = node.base.was_generated;
		if (node.type != null) {
			node.type.base.was_generated = node.base.was_generated;
		}
		if (node.expression_operator != null) {
			node.expression_operator.base.was_generated = node.base.was_generated;
		}
		if (node.expression != null) {
			node.expression.base.was_generated = node.base.was_generated;
		}
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		node.target.base.was_generated = node.base.was_generated;
		node.operator.base.was_generated = node.base.was_generated;
		node.expression.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {
		node.target.base.was_generated = node.base.was_generated;
		node.operator.base.was_generated = node.base.was_generated;
		node.expression.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		node.delimited.base.was_generated = node.base.was_generated;
		if (node.expression != null) {
			node.expression.base.was_generated = node.base.was_generated;
		}
	}
	else if (node.base.kind == Code_Kind.OPERATOR) {
		// nothing to do here
	}
	else if (node.base.kind == Code_Kind.MINUS) {
		node.operator.base.was_generated = node.base.was_generated;
		node.expression.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.NOT) {
		node.operator.base.was_generated = node.base.was_generated;
		node.expression.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		node.target.base.was_generated = node.base.was_generated;
		node.operator.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		node.target.base.was_generated = node.base.was_generated;
		node.operator.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		node.target.base.was_generated = node.base.was_generated;
		node.delimited.base.was_generated = node.base.was_generated;
		node.index.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		node.left.base.was_generated = node.base.was_generated;
		node.operator.base.was_generated = node.base.was_generated;
		node.right.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.INTEGER) {
	}
	else if (node.base.kind == Code_Kind.FLOAT) {
	}
	else if (node.base.kind == Code_Kind.BOOL) {
	}
	else if (node.base.kind == Code_Kind.CHAR) {
	}
	else if (node.base.kind == Code_Kind.STRING) {
	}
	else if (node.base.kind == Code_Kind.ARRAY_LITERAL) {
		throw Error("infer_was_generated: incomplete, array literal");
	}
	else if (node.base.kind == Code_Kind.STRUCT_LITERAL) {
		throw Error("infer_was_generated: incomplete, struct literal");
	}
	else if (node.base.kind == Code_Kind.ENUM_DEFINITION) {
		node.keyword.base.was_generated = node.base.was_generated;
		node.block.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.STRUCT_DEFINITION) {
		node.keyword.base.was_generated = node.base.was_generated;
		node.block.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
		node.parameters.base.was_generated = node.base.was_generated;
		if (node.operator != null) {
			node.operator.base.was_generated = node.base.was_generated;
		}
		if (node.returns != null) {
			node.returns.base.was_generated = node.base.was_generated;
		}
		node.block.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.KEYWORD) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.IF) {
		node.keyword.base.was_generated = node.base.was_generated;
		if (node.then_keyword != null) {
			node.then_keyword.base.was_generated = node.base.was_generated;
		}
		node.condition.base.was_generated = node.base.was_generated;
		node.statement.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.ELSE) {
		node.keyword.base.was_generated = node.base.was_generated;
		node.statement.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.WHILE) {
		node.keyword.base.was_generated = node.base.was_generated;
		node.condition.base.was_generated = node.base.was_generated;
		node.statement.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.FOR) {
		node.keyword.base.was_generated = node.base.was_generated;
		node.scope.base.was_generated = node.base.was_generated;
		node.set.base.was_generated = node.base.was_generated;
		node.statement.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.INTEGER_SET) {
		node.begin_it.base.was_generated = node.base.was_generated;
		node.separator.base.was_generated = node.base.was_generated;
		node.end_it.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.BREAK) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.RETURN) {
		node.expression.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.CALL) {
		node.procedure.base.was_generated = node.base.was_generated;
		node.args.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {
		node.operator.base.was_generated = node.base.was_generated;
		node.expression.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		node.operator.base.was_generated = node.base.was_generated;
		node.expression.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.CAST) {
		node.target_type.base.was_generated = node.base.was_generated;
		node.expression.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		node.left.base.was_generated = node.base.was_generated;
		node.operator.base.was_generated = node.base.was_generated;
		node.right.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.SYSCALL) {
	}
	else if (node.base.kind == Code_Kind.POINTER_TYPE) {
		node.operator.base.was_generated = node.base.was_generated;
		node.elem_type.base.was_generated = node.base.was_generated;
	}
	else if (node.base.kind == Code_Kind.ARRAY_TYPE) {
		if (node.size != null) {
			node.size.base.was_generated = node.base.was_generated;
		}
		node.elem_type.base.was_generated = node.base.was_generated;
		node.begin_operator.base.was_generated = node.base.was_generated;
		node.end_operator.base.was_generated = node.base.was_generated;
	}
	else {
		throw Error("infer_was_generated: unknown Code_Kind: '" + node.base.kind + "'");
	}
	return node;
}
function infer_push_scope(node) {
	if (node.base.kind == Code_Kind.SCOPE) {
		if (node.is_implicit) {
			for (let decl of node.declarations) {
				node.base.enclosing_scope.declarations.push(decl);
			}
		}
	}
	else {
		throw Error("infer_push_scope: unknown Code_Kind: '" + node.base.kind + "'");
	}
}
function infer_enclosing_scope(node) {
	if (node == null) {
		return;
	}
	if (node.base.kind == Code_Kind.SCOPE) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {
		if (node.expression != null) {
			node.expression.base.enclosing_scope = node.base.enclosing_scope;
		}
	}
	else if (node.base.kind == Code_Kind.DELIMITED) {
		node.scope.base.enclosing_scope = node.base.enclosing_scope;
		if (node.begin != null) {
			node.begin.base.enclosing_scope = node.base.enclosing_scope;
		}
		if (node.separator != null) {
			node.separator.base.enclosing_scope = node.base.enclosing_scope;
			for (let separator of node.all_separators) {
				separator.base.enclosing_scope = node.scope;
			}
		}
		for (let elem of node.elements) {
			elem.base.enclosing_scope = node.scope;
		}
		if (node.end != null) {
			node.end.base.enclosing_scope = node.base.enclosing_scope;
		}
	}
	else if (node.base.kind == Code_Kind.BLOCK) {
		node.delimited.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.INTEGER) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.FLOAT) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.BOOL) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.CHAR) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.STRING) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.ARRAY_LITERAL) {
		node.delimited.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.STRUCT_LITERAL) {
		throw Error("infer_enclosing_scope: struct literal");
		let names = Object.keys(node.value);
		for (let name of names) {
			let member = node.value[name];
			member.base.enclosing_scope = node.base.enclosing_scope;
		}
	}
	else if (node.base.kind == Code_Kind.STRUCT_DEFINITION) {
		node.block.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.ENUM_DEFINITION) {
		throw Error("infer_enclosing_scope: enum definition");
		for (let member of node.members.delimited.elements) {
			member.base.enclosing_scope = node.base.enclosing_scope;
		}
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
		if (node.parameters != null) {
			node.parameters.base.enclosing_scope = node.scope;
		}
		if (node.operator != null) {
			node.operator.base.enclosing_scope = node.scope;
		}
		if (node.returns != null) {
			node.returns.base.enclosing_scope = node.scope;
		}
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {
		node.ident.base.enclosing_scope = node.base.enclosing_scope;
		if (node.type_operator != null) {
			node.type_operator.base.enclosing_scope = node.base.enclosing_scope;
		}
		if (node.type != null) {
			node.type.base.enclosing_scope = node.base.enclosing_scope;
		}
		if (node.expression_operator != null) {
			node.expression_operator.base.enclosing_scope = node.base.enclosing_scope;
		}
		if (node.expression != null) {
			node.expression.base.enclosing_scope = node.base.enclosing_scope;
		}
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		node.target.base.enclosing_scope = node.base.enclosing_scope;
		node.operator.base.enclosing_scope = node.base.enclosing_scope;
		node.expression.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {
		node.target.base.enclosing_scope = node.base.enclosing_scope;
		node.operator.base.enclosing_scope = node.base.enclosing_scope;
		node.expression.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		node.delimited.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.MINUS) {
		node.expression.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.NOT) {
		node.expression.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.OPERATOR) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		node.left.base.enclosing_scope = node.base.enclosing_scope;
		node.operator.base.enclosing_scope = node.base.enclosing_scope;
		node.right.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		node.left.base.enclosing_scope = node.base.enclosing_scope;
		node.right.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		node.target.base.enclosing_scope = node.base.enclosing_scope;
		node.delimited.base.enclosing_scope = node.base.enclosing_scope;
		node.index.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.CAST) {
		node.target_type.base.enclosing_scope = node.base.enclosing_scope;
		node.expression.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {
		node.expression.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		node.expression.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		node.target.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		node.target.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.KEYWORD) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.IF) {
		node.keyword.base.enclosing_scope = node.base.enclosing_scope;
		if (node.condition != null) {
			node.condition.base.enclosing_scope = node.base.enclosing_scope;
		}
		if (node.then_keyword != null) {
			node.then_keyword.base.enclosing_scope = node.base.enclosing_scope;
		}
		if (node.statement != null) {
			node.statement.base.enclosing_scope = node.base.enclosing_scope;
		}
	}
	else if (node.base.kind == Code_Kind.ELSE) {
		node.keyword.base.enclosing_scope = node.base.enclosing_scope;
		if (node.statement != null) {
			node.statement.base.enclosing_scope = node.base.enclosing_scope;
		}
	}
	else if (node.base.kind == Code_Kind.WHILE) {
		node.keyword.base.enclosing_scope = node.base.enclosing_scope;
		if (node.condition != null) {
			node.condition.base.enclosing_scope = node.base.enclosing_scope;
		}
		if (node.statement != null) {
			node.statement.base.enclosing_scope = node.base.enclosing_scope;
		}
	}
	else if (node.base.kind == Code_Kind.FOR) {
		node.keyword.base.enclosing_scope = node.base.enclosing_scope;
		node.set.base.enclosing_scope = node.base.enclosing_scope;
		node.scope.base.enclosing_scope = node.base.enclosing_scope;
		node.statement.base.enclosing_scope = node.scope;
	}
	else if (node.base.kind == Code_Kind.INTEGER_SET) {
		node.begin_it.base.enclosing_scope = node.base.enclosing_scope;
		node.separator.base.enclosing_scope = node.base.enclosing_scope;
		node.end_it.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.BREAK) {
		node.keyword.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {
		node.keyword.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.RETURN) {
		node.keyword.base.enclosing_scope = node.base.enclosing_scope;
		if (node.expression) {
			node.expression.base.enclosing_scope = node.base.enclosing_scope;
		}
	}
	else if (node.base.kind == Code_Kind.CALL) {
		node.procedure.base.enclosing_scope = node.base.enclosing_scope;
		node.args.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.SYSCALL) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.POINTER_TYPE) {
		node.elem_type.base.enclosing_scope = node.base.enclosing_scope;
	}
	else if (node.base.kind == Code_Kind.ARRAY_TYPE) {
		node.elem_type.base.enclosing_scope = node.base.enclosing_scope;
		node.size.base.enclosing_scope = node.base.enclosing_scope;
	}
	else {
		throw Error("infer_enclosing_scope: unknown Code_Kind '" + node.base.kind + "'");
	}
}
function infer_run_disable(node) {
	if (node == null) {
		return;
	}
	if (node.base.kind == Code_Kind.SCOPE) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {
		if (node.expression != null) {
			node.expression.base.run_disable = node.base.run_disable;
			node.expression.base.run_silent = node.base.run_silent;
		}
	}
	else if (node.base.kind == Code_Kind.DELIMITED) {
		node.scope.base.run_disable = node.base.run_disable;
		node.scope.base.run_silent = node.base.run_silent;
		if (node.begin != null) {
			node.begin.base.run_disable = node.base.run_disable;
			node.begin.base.run_silent = node.base.run_silent;
		}
		if (node.separator != null) {
			node.separator.base.run_disable = node.base.run_disable;
			node.separator.base.run_silent = node.base.run_silent;
			for (let separator of node.all_separators) {
				separator.base.run_disable = node.base.run_disable;
				separator.base.run_silent = node.base.run_silent;
			}
		}
		for (let elem of node.elements) {
			elem.base.run_disable = node.base.run_disable;
			elem.base.run_silent = node.base.run_silent;
		}
		if (node.end != null) {
			node.end.base.run_disable = node.base.run_disable;
			node.end.base.run_silent = node.base.run_silent;
		}
	}
	else if (node.base.kind == Code_Kind.BLOCK) {
		node.delimited.base.run_disable = node.base.run_disable;
		node.delimited.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.INTEGER) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.FLOAT) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.BOOL) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.CHAR) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.STRING) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.ARRAY_LITERAL) {
		node.delimited.base.run_disable = node.base.run_disable;
		node.delimited.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.STRUCT_LITERAL) {
		throw Error("infer_run_disable: struct literal");
		let names = Object.keys(node.value);
		for (let name of names) {
			let member = node.value[name];
			member.base.run_disable = node.base.run_disable;
			member.base.run_silent = node.base.run_silent;
		}
	}
	else if (node.base.kind == Code_Kind.STRUCT_DEFINITION) {
		node.block.base.run_disable = node.base.run_disable;
		node.block.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.ENUM_DEFINITION) {
		throw Error("infer_run_disable: enum definition");
		for (let member of node.members.delimited.elements) {
			member.base.run_disable = node.base.run_disable;
			member.base.run_silent = node.base.run_silent;
		}
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
		if (node.parameters != null) {
			node.parameters.base.run_disable = node.base.run_disable;
			node.parameters.base.run_silent = node.base.run_silent;
		}
		if (node.operator != null) {
			node.operator.base.run_disable = node.base.run_disable;
			node.operator.base.run_silent = node.base.run_silent;
		}
		if (node.returns != null) {
			node.returns.base.run_disable = node.base.run_disable;
			node.returns.base.run_silent = node.base.run_silent;
		}
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {
		node.ident.base.run_disable = node.base.run_disable;
		node.ident.base.run_silent = node.base.run_silent;
		if (node.type_operator != null) {
			node.type_operator.base.run_disable = node.base.run_disable;
			node.type_operator.base.run_silent = node.base.run_silent;
		}
		if (node.type != null) {
			node.type.base.run_disable = node.base.run_disable;
			node.type.base.run_silent = node.base.run_silent;
		}
		if (node.expression_operator != null) {
			node.expression_operator.base.run_disable = node.base.run_disable;
			node.expression_operator.base.run_silent = node.base.run_silent;
		}
		if (node.expression != null) {
			node.expression.base.run_disable = node.base.run_disable;
			node.expression.base.run_silent = node.base.run_silent;
		}
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		node.target.base.run_disable = node.base.run_disable;
		node.target.base.run_silent = node.base.run_silent;
		node.operator.base.run_disable = node.base.run_disable;
		node.operator.base.run_silent = node.base.run_silent;
		node.expression.base.run_disable = node.base.run_disable;
		node.expression.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {
		node.target.base.run_disable = node.base.run_disable;
		node.target.base.run_silent = node.base.run_silent;
		node.operator.base.run_disable = node.base.run_disable;
		node.operator.base.run_silent = node.base.run_silent;
		node.expression.base.run_disable = node.base.run_disable;
		node.expression.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		node.delimited.base.run_disable = node.base.run_disable;
		node.delimited.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.MINUS) {
		node.expression.base.run_disable = node.base.run_disable;
		node.expression.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.NOT) {
		node.expression.base.run_disable = node.base.run_disable;
		node.expression.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.OPERATOR) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		node.left.base.run_disable = node.base.run_disable;
		node.left.base.run_silent = node.base.run_silent;
		node.operator.base.run_disable = node.base.run_disable;
		node.operator.base.run_silent = node.base.run_silent;
		node.right.base.run_disable = node.base.run_disable;
		node.right.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		node.left.base.run_disable = node.base.run_disable;
		node.left.base.run_silent = node.base.run_silent;
		node.right.base.run_disable = node.base.run_disable;
		node.right.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		node.target.base.run_disable = node.base.run_disable;
		node.target.base.run_silent = node.base.run_silent;
		node.delimited.base.run_disable = node.base.run_disable;
		node.delimited.base.run_silent = node.base.run_silent;
		node.index.base.run_disable = node.base.run_disable;
		node.index.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.CAST) {
		node.target_type.base.run_disable = node.base.run_disable;
		node.target_type.base.run_silent = node.base.run_silent;
		node.expression.base.run_disable = node.base.run_disable;
		node.expression.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {
		node.expression.base.run_disable = node.base.run_disable;
		node.expression.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		node.expression.base.run_disable = node.base.run_disable;
		node.expression.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		node.target.base.run_disable = node.base.run_disable;
		node.target.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		node.target.base.run_disable = node.base.run_disable;
		node.target.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.KEYWORD) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.IF) {
		node.keyword.base.run_disable = node.base.run_disable;
		node.keyword.base.run_silent = node.base.run_silent;
		if (node.condition != null) {
			node.condition.base.run_disable = node.base.run_disable;
			node.condition.base.run_silent = node.base.run_silent;
		}
		if (node.then_keyword != null) {
			node.then_keyword.base.run_disable = node.base.run_disable;
			node.then_keyword.base.run_silent = node.base.run_silent;
		}
		if (node.statement != null) {
			node.statement.base.run_disable = node.base.run_disable;
			node.statement.base.run_silent = node.base.run_silent;
		}
	}
	else if (node.base.kind == Code_Kind.ELSE) {
		node.keyword.base.run_disable = node.base.run_disable;
		node.keyword.base.run_silent = node.base.run_silent;
		if (node.statement != null) {
			node.statement.base.run_disable = node.base.run_disable;
			node.statement.base.run_silent = node.base.run_silent;
		}
	}
	else if (node.base.kind == Code_Kind.WHILE) {
		node.keyword.base.run_disable = node.base.run_disable;
		node.keyword.base.run_silent = node.base.run_silent;
		if (node.condition != null) {
			node.condition.base.run_disable = node.base.run_disable;
			node.condition.base.run_silent = node.base.run_silent;
		}
		if (node.statement != null) {
			node.statement.base.run_disable = node.base.run_disable;
			node.statement.base.run_silent = node.base.run_silent;
		}
	}
	else if (node.base.kind == Code_Kind.FOR) {
		node.keyword.base.run_disable = node.base.run_disable;
		node.keyword.base.run_silent = node.base.run_silent;
		node.set.base.run_disable = node.base.run_disable;
		node.set.base.run_silent = node.base.run_silent;
		node.scope.base.run_disable = node.base.run_disable;
		node.scope.base.run_silent = node.base.run_silent;
		node.statement.base.run_disable = node.base.run_disable;
		node.statement.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.INTEGER_SET) {
		node.begin_it.base.run_disable = node.base.run_disable;
		node.begin_it.base.run_silent = node.base.run_silent;
		node.separator.base.run_disable = node.base.run_disable;
		node.separator.base.run_silent = node.base.run_silent;
		node.end_it.base.run_disable = node.base.run_disable;
		node.end_it.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.BREAK) {
		node.keyword.base.run_disable = node.base.run_disable;
		node.keyword.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {
		node.keyword.base.run_disable = node.base.run_disable;
		node.keyword.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.RETURN) {
		node.keyword.base.run_disable = node.base.run_disable;
		node.keyword.base.run_silent = node.base.run_silent;
		if (node.expression) {
			node.expression.base.run_disable = node.base.run_disable;
			node.expression.base.run_silent = node.base.run_silent;
		}
	}
	else if (node.base.kind == Code_Kind.CALL) {
		node.procedure.base.run_disable = node.base.run_disable;
		node.procedure.base.run_silent = node.base.run_silent;
		node.args.base.run_disable = node.base.run_disable;
		node.args.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.SYSCALL) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.POINTER_TYPE) {
		node.elem_type.base.run_disable = node.base.run_disable;
		node.elem_type.base.run_silent = node.base.run_silent;
	}
	else if (node.base.kind == Code_Kind.ARRAY_TYPE) {
		node.elem_type.base.run_disable = node.base.run_disable;
		node.elem_type.base.run_silent = node.base.run_silent;
		node.size.base.run_disable = node.base.run_disable;
		node.size.base.run_silent = node.base.run_silent;
	}
	else {
		throw Error("infer_run_disable: unknown Code_Kind '" + node.base.kind + "'");
	}
}
function infer_enum_values(node) {
	let curr_value = 0;
	for (let member of node.members) {
		if (member.value) {
			if (member.value.base.kind != Code_Kind.INTEGER) {
				throw Error("Enum member has a non-integer value");
			}
			if (member.value.value < curr_value) {
				throw Error("Enum member has a value that is less than the previous value");
			}
			if (node.is_flags) {
				if (!Number.isInteger(Math.log2(member.value.value))) {
					throw Error("enum_flags member value is not a power of 2");
				}
			}
			curr_value = member.value.value;
		}
		else {
			member.value = make_integer(curr_value);
			member.value.base.type = primitive_type_infos.size_t;
			// @Cleanup
			// nocheckin
			// member.base.type = primitive_type_infos.size_t;
			if (node.is_flags) {
				if (curr_value == 0) {
					curr_value = 1;
				}
				else {
					curr_value *= 2;
				}
			}
			else {
				curr_value += 1;
			}
		}
	}
}
function infer_decl_of_name(name, start_scope) {
	if (name in primitive_type_decls) {
		return primitive_type_decls[name];
	}
	let curr_scope = start_scope;
	while (curr_scope) {
		let maybe_decl = infer_decl_of_name_in_scope(name, curr_scope);
		if (maybe_decl) {
			return maybe_decl;
		}
		curr_scope = curr_scope.base.enclosing_scope;
	}
	return null;
}
function infer_decl_of_name_in_scope(name, scope) {
	for (let decl of scope.declarations) {
		if (decl.ident.name == name) {
			return decl;
		}
	}
	return null;
}
function find_argument_scope(node) {
	let curr_scope = node.base.enclosing_scope;
	while (curr_scope) {
		if (curr_scope.is_argument_scope) {
			return curr_scope;
		}
		curr_scope = curr_scope.base.enclosing_scope;
	}
	return null;
}
function find_procedure_definition(node) {
	let curr_scope = node.base.enclosing_scope;
	while (curr_scope) {
		if (curr_scope.belongs_to != null && curr_scope.belongs_to.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
			return curr_scope.belongs_to;
		}
		curr_scope = curr_scope.base.enclosing_scope;
	}
	return null;
}
function infer_type(node) {
	if (node == null) {
		return;
	}
	if (node.base.kind == Code_Kind.IDENT) {
		if (node.name == "") {
			return null;
		}
		if (node.name in primitive_type_infos) {
			return primitive_type_infos[node.name];
		}
		// :TypeInfo
		if (node.name == "Type") {
			return null;
		}
		if (node.declaration == null) {
			infer(node);
		}
		let user_type = node.declaration.ident.base.type;
		if (user_type == null) {
			// :TypeInfo
			return null;
		}
		if (user_type.base.kind == Type_Kind.STRUCT) {
			return user_type;
		}
		else if (user_type) {
			// probably an alias to one of the primitives
			return user_type;
		}
		else {
			throw Error("infer_type: cannot infer type of ident");
		}
	}
	else if (node.base.kind == Code_Kind.MINUS) {
		let type;
		if (node.expression.base.type.base.kind == Type_Kind.INTEGER) {
			type = make_type_info_integer(node.expression.base.type.base.size_in_bytes, true);
		}
		else if (node.expression.base.type.base.kind == Type_Kind.FLOAT) {
			type = make_type_info_float(node.expression.base.type.base.size_in_bytes);
		}
		else if (node.expression.base.type.base.kind == Type_Kind.BOOL) {
			type = primitive_type_infos.bool;
		}
		else {
			throw Error("Trying to do unary minus with type kind '" + node.expression.base.type.base.kind + "', which is not allowed");
		}
		return type;
	}
	else if (node.base.kind == Code_Kind.NOT) {
		let type;
		if (node.expression.base.type.base.kind == Type_Kind.BOOL) {
			type = primitive_type_infos.bool;
		}
		else {
			throw Error("Trying to do unary not with type kind '" + node.expression.base.type.base.kind + "', which is not allowed");
		}
		return type;
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		// direct comparison
		if (node.operator.str == "==" || node.operator.str == "!=") {
			return primitive_type_infos.bool;
		}
		// logical comparison
		else if (node.operator.str == "&&" || node.operator.str == "||") {
			if (node.left.base.type.base.kind != Type_Kind.ENUM && node.right.base.type.base.kind != Type_Kind.ENUM) {
				return primitive_type_infos.bool;
			}
		}
		// relative comparison
		else if (node.operator.str == "<"  || node.operator.str == ">"  ||
		         node.operator.str == "<=" || node.operator.str == ">=") {

			if (node.left.base.type.base.kind != Type_Kind.BOOL && node.right.base.type.base.kind != Type_Kind.BOOL) {
				return primitive_type_infos.bool;
			}
		}
		// bitwise
		else if (node.operator.str == "&" || node.operator.str == "|") {
			let types_match = check_that_types_match(node.left.base.type, node.right.base.type);
			if (types_match) {
				return node.left.base.type;
			}
		}
		// arithmetic
		else if (node.operator.str == "+"  || node.operator.str == "-"  ||
		         node.operator.str == "*" || node.operator.str == "/" ||
		         node.operator.str == "%") {

			if (node.left.base.type.base.kind == Type_Kind.INTEGER) {
				if (node.right.base.type.base.kind == Type_Kind.INTEGER) {
					let size_in_bytes = Math.max(node.left.base.type.base.size_in_bytes, node.right.base.type.base.size_in_bytes);
					let signed = node.left.base.type.signed || node.right.base.type.signed;
					return make_type_info_integer(size_in_bytes, signed);
				}
				else if (node.right.base.type.base.kind == Type_Kind.FLOAT) {
					let size_in_bytes = Math.max(node.left.base.type.base.size_in_bytes, node.right.base.type.base.size_in_bytes);
					return make_type_info_float(size_in_bytes);
				}
				else if (node.right.base.type.base.kind == Type_Kind.BOOL) {
					// :ImplicitCast
					// return primitive_type_infos.bool;
				}
			}
			else if (node.left.base.type.base.kind == Type_Kind.FLOAT) {
				if (node.right.base.type.base.kind == Type_Kind.INTEGER) {
					let size_in_bytes = Math.max(node.left.base.type.base.size_in_bytes, node.right.base.type.base.size_in_bytes);
					return make_type_info_float(size_in_bytes);
				}
				else if (node.right.base.type.base.kind == Type_Kind.FLOAT) {
					let size_in_bytes = Math.max(node.left.base.type.base.size_in_bytes, node.right.base.type.base.size_in_bytes);
					return make_type_info_float(size_in_bytes);
				}
				else if (node.right.base.type.base.kind == Type_Kind.BOOL) {
					// an implicit cast does not make sense here
				}
			}
			else if (node.left.base.type.base.kind == Type_Kind.BOOL) {
				if (node.right.base.type.base.kind == Type_Kind.BOOL) {
					// bools can only be compared
				}
			}
			else if (node.left.base.type.base.kind == Type_Kind.CHAR) {
				if(node.right.base.type.base.kind == Type_Kind.CHAR) {
					return primitive_type_infos.char;
				}
				else if (node.right.base.type.base.kind == Type_Kind.STRING) {
					return primitive_type_infos.string;
				}
			}
			else if (node.left.base.type.base.kind == Type_Kind.ENUM) {
				if (node.right.base.type.base.kind == Type_Kind.ENUM) {
					let types_match = check_that_types_match(node.left.base.type, node.right.base.type);
					if (types_match) {
						return node.left.base.type;
					}
				}
			}
			else if (node.left.base.type.base.kind == Type_Kind.STRING) {
				if (node.right.base.type.base.kind == Type_Kind.CHAR) {
					return primitive_type_infos.string;
				}
				else if (node.right.base.type.base.kind == Type_Kind.STRING) {
					return primitive_type_infos.string;
				}
			}
			throw Error("Binary operation '" + node.operator.str + "' is not allowed with '" + node.left.base.type.base.kind + "' and '" + node.right.base.type.base.kind + "'");
		}
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {
		infer(node.expression);
		if (node.expression.base.kind == Code_Kind.REFERENCE) {
			throw Error;
		}
		return make_type_info_pointer(node.expression.base.type);
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		infer(node.expression);
		if (node.expression.base.type.base.kind != Type_Kind.POINTER) {
			throw Error("Trying to dereference a non-pointer");
		}
		return node.expression.base.type.elem_type;
	}
	else if (node.base.kind == Code_Kind.CAST) {
		return infer_type(node.target_type);
	}
	else if (node.base.kind == Code_Kind.ARRAY_LITERAL) {
		let element_type;
		for (let i = 0; i < node.delimited.elements.length; i += 1) {
			let element = node.delimited.elements[i];
			infer(element);
			let curr_element_type = element.base.type;
			if (!element_type) {
				element_type = curr_element_type;
				continue;
			}
			// @Incomplete
			// this should be moved into its own function
			// when types don't match, try to cast
			// and when that fails, throw error
			// :ImplicitCast
			if (element_type.base.kind == Type_Kind.INTEGER) {
				if (curr_element_type.base.kind == Type_Kind.FLOAT) {
					element_type = curr_element_type;
				}
				else if (curr_element_type.base.kind == Type_Kind.INTEGER) {
					if (element_type.signed == false && curr_element_type.signed == true) {
						element_type = curr_element_type;
					}
					if (element_type.base.size_in_bytes < curr_element_type.base.size_in_bytes) {
						element_type = curr_element_type;
					}
				}
			}
			else if (element_type.base.kind == Type_Kind.FLOAT) {
				if (curr_element_type.base.kind == Type_Kind.FLOAT) {
					if (element_type.base.size_in_bytes < curr_element_type.base.size_in_bytes) {
						element_type = curr_element_type;
					}
				}
				else if (curr_element_type.base.kind == Type_Kind.INTEGER) {
					// @Incomplete
					// :ImplicitCast
					throw Error("infer_type: need to cast integer to float");
				}
			}
			else if (element_type.base.kind == Type_Kind.ENUM) {
				let types_match = check_that_types_match(element_type, curr_element_type);
				if (types_match == false) {
					throw Error("infer_type: enum types in array literal did not match");
				}
			}
			else if (element_type.base.kind == Type_Kind.ARRAY) {
				// @Incomplete
				// :NestedArray
				// nocheckin
				throw Error("infer_type: nested array literals are not yet supported");
			}
			else if (element_type.base.kind == Type_Kind.STRUCT) {
				// @Incomplete
				// need to check that types match
				if (curr_element_type.base.kind != Type_Kind.STRUCT) {
					throw Error("infer_type: in an array literal, the current element is a struct, but the previous element isn't")
				}
				let types_match = check_that_types_match(curr_element_type, element_type);
				if (types_match == false) {
					throw Error("infer_type: the elements of an array of structs don't match");
				}
			}
		}
		return make_type_info_array(element_type, node.delimited.elements.length);
	}
	else if (node.base.kind == Code_Kind.STRUCT_LITERAL) {
		let names = Object.keys(node.value);
		for (let name of names) {
			let member_value = node.value[name];
			infer(member_value);
		}
		return make_type_info_struct_literal(node);
	}
	else if (node.base.kind == Code_Kind.STRUCT_DEFINITION) {
		// @Incomplete
		// :Next
		// The type of a Type is Type
		throw Error("infer_type: struct definitions need :TypeInfo");
	}
	else if (node.base.kind == Code_Kind.ENUM_DEFINITION) {
		let elem_type = primitive_type_infos.size_t;
		let type = make_type_info_enum(elem_type);
		type.is_flags = node.is_flags;
		type.map_name_to_value = {};
		type.map_value_to_name = {};
		for (let stmt of node.members.delimited.elements) {
			// nocheckin
			// empty expressions should probably not be allowed in enum definitions
			if (stmt.expression == null) {
				continue;
			}
			let member = stmt.expression;
			if (member.ident.name in type.map_name_to_value) {
				throw Error("Enum name used more than once");
			}
			if (member.value.value in type.map_value_to_name) {
				throw Error("Enum value used more than once");
			}
			type.map_name_to_value[member.ident.name] = member.value.value;
			type.map_value_to_name[member.value.value] = member.ident.name;
		}
		return type;
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
		let parameter_types = new Array();
		let return_types = new Array();
		for (let param of node.parameters.elements) {
			parameter_types.push(param.ident.base.type);
		}
		if (node.returns != null) {
			for (let retn of node.returns.elements) {
				if (retn.base.kind == Code_Kind.IDENT) {
					// :TypeInfo
					// the type of a type is Type
					return_types.push(retn.base.type);
				}
				else if (retn.base.kind == Code_Kind.DECLARATION) {
					return_types.push(retn.ident.base.type);
				}
				else {
					throw Error("infer_type: procedure returns can only be idents or declarations");
				}
			}
		}
		return make_type_info_procedure(parameter_types, return_types);
	}
	else if (node.base.kind == Code_Kind.POINTER_TYPE) {
		let elem_type = infer_type(node.elem_type);
		let type = make_type_info_pointer(elem_type);
		return type;
	}
	else if (node.base.kind == Code_Kind.ARRAY_TYPE) {
		let elem_type = infer_type(node.elem_type);
		let type = make_type_info_array(elem_type, node.size.value);
		// :DynamicArray
		type.base.size_in_bytes = elem_type.base.size_in_bytes * node.size.value;
		return type;
	}
	else if (node.base.kind == Code_Kind.STRING) {
		node.base.type = User_Types.string;
		return node.base.type;
	}
}