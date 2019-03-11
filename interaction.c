#include "interaction.h"

void init_interaction() {
    interaction_data.show_values = false;
    interaction_data.show_changes = false;
    interaction_data.show_parens = false;
    interaction_data.show_elements = false;
    interaction_data.expand_all = false;
    interaction_data.execution_index = 0;
    interaction_data.column_index = 0;
    interaction_data.flow_index = 1;
    interaction_data.scroll_x = 0;
    interaction_data.scroll_y = 0;
    
    interaction_data.flows = malloc(sizeof(struct Flow_Array));
    array_init(interaction_data.flows, sizeof(struct Indices_Array), 10);
    for (size_t i = 0; i < 10; i += 1) {
        array_next(interaction_data.flows);
        struct Indices_Array* indices = interaction_data.flows->last;
        array_init(indices, sizeof(size_t), 10);
    }
}