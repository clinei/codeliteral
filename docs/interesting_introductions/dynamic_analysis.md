# Dynamic Analysis

If we record the whole program, we can check way more than just the parameters to a function. We can also check the order in which they are called, and we don't have to do any complicated bookkeeping on the library side. We can point out things outside the library, like doing bad things to memory that wasn't ours, or doing things at the wrong time.