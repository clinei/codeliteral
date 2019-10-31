# Scripts

If we record an entire program run, we need a way to analyze that data. That's where scripts come in. We can read all the data, and log every action. We can later display it using simple drawing primitives, or more advanced data science methods provided by the standard library. Iterating over every tiny element of execution might be slow, so we select the points in the program that our expensive processing functions use as context. We write a function that is run when a script is initialized, in which we tell the system which contexts we want our hooks to run in. We write a function to gather the term nodes, and we write a function to terminate one chain and start the next. We also write a function that displays each chain of terms on separate lines.

Let's say we have a recursive factorial, and we want to print out the parameter for each call chain.

The source code looks like this:
```c
int factorial(int term) {
    if (term == 1) {
        return 1;
    }
    else {
        return factorial(term - 1) * term;
    }
}
int main() {
    factorial(5);
    return 0;
}
```

And the script looks like this:
```c
Code_Node*** term_chains;
uint* chain_sizes;
uint curr_chain = 0;

Marker* factorial_terminate_marker;

int chain_count = 10;
int term_count = 10;

float* graph_numbers;
uint graph_length = 0;

void init(System* system) {

    // system contains the entire debugger state
    Code_Node* global_block = system->selected_run->global_block;

    // initialize the arrays to store the terms of each call chain
    term_chains = malloc(sizeof(Code_Node**) * chain_count);
    chain_sizes = malloc(sizeof(uint) * chain_count);
    for (int i = 0; i < chain_count; i++) {
        term_chains[i] = malloc(sizeof(Code_Node*) * term_count);
        chain_sizes[i] = 0;
    }

    // find the function declaration using the call inside main
    Code_Node* main_fn = global_block->block.statements->last->declaration.expression;
    Code_Node* factorial_call = main_fn->procedure.block->statements->first[0];
    Code_Node* factorial_fn = factorial_call->call.ident->declaration.expression;
    hook_function(factorial_fn, &factorial_hook);

    // get the location of `return 0` that we marked manually
    factorial_terminate_marker = system->markers[0];
    hook_marker(factorial_terminate_marker, &factorial_terminate);

    // gets called every time the diagram is in view
    hook_draw_diagram("factorial_terms", &factorial_draw_terms);

    // gets called after all normal hooks, to clean up or post-process
    hook_posthook(&posthook);
}
void factorial_hook(Code_Node* node) {

    // node is the executed function body, as a Code_Block
    Code_Node* term = node->block.statements->first[1]->declaration.expression;
    uint value = term->return_node->literal_uint.value;

    uint curr_term = chain_sizes[curr_chain];
    term_chains[curr_chain][curr_term] = term;

    chain_sizes[curr_chain] += 1;
}
void factorial_terminate(Code_Node* node) {

    // node is the source code element marked manually
    // this time, it's a return expression

    // every `return 0` ends the chain
    curr_chain += 1;
}
void factorial_draw_terms() {
    float x = 0;
    float y = 0;
    float text_size = 12.0;

    // clear to rgba black
    draw_clear(0.0, 0.0, 0.0, 1.0);

    for (int i = 0; i < chain_count; i++) {
        for (int j = 0; j < chain_sizes[i]; j++) {
            Code_Node* term = term_chains[i][j];
            // draw with rgba white
            draw_text(term->return_node->str, &x, &y, text_size, 1.0, 1.0, 1.0, 1.0);
            // we can set a default color that we use when no color arguments are provided
            draw_color(1.0, 0.0, 0.0, 1.0);
            draw_text(" ", &x, &y, text_size);
        }
        // newline
        x = 0;
        y += text_size;
    }
}
void posthook() {
    for (int i = 0; i < chain_count) {
        graph_length += chain_sizes[i];
    }
    graph_numbers = malloc(sizeof(float) * graph_length);
    int n = 0;
    for (int i = 0; i < chain_count) {
        for (int j = 0; j < chain_sizes[i]; j++) {
            Code_Node* term = term_chains[i][j];
            uint value = term->return_node->literal_uint.value;
            graph_numbers[n] = (float)value;
            n += 1;
        }
    }
    
    // we can register diagrams after the data has been gathered
    // because the number and kind of diagrams might depend on the data
    hook_draw_diagram("factorial_graph", &factorial_draw_graph);
}
void factorial_draw_graph() {
    draw_clear(0.0, 0.0, 0.0, 1.0);
    draw_color(1.0, 1.0, 1.0, 1.0);

    // we draw a simple time series where X is the array index and Y is the value
    draw_graph(graph_numbers, graph_length);
}
```

Notice that you have total control over which hooks run where, and how the results are stored and displayed. You can even use the state of the debugging system, like the current cursor location, to display the results differently, like showing only the terms of the current chain, or highlighting the current term, or showing the prev and next terms.

Because the hooks are usually independent, and the data is integrated in the last step, we can parallelize the hooks. We can partition the points registered on init to run on different cores and get the appropriate speed boost. We don't yet know if such a speed boost is necessary. If it's not, then we could allow hooks to register new hooks themselves, like when a data structure gets allocated dynamically, we can record the data and the address, and then find out where that data gets used and changed and how. When there is a data dependency between the hooks, we can't run them in parallel. Maybe the user should decide when to parallelize, because the system can't intuit data dependencies without running the code.

Figuring this out would be easier if we had a system to test it on. It has to be non-interactive, because we need a lot of changes in every system to enable pausing and resuming of execution. We're gonna start with a physics simulation.