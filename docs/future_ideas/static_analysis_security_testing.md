# Static Analysis

According to CodeSonar, we can detect the impact of statements using static analysis, and pinpoint where a variable was assigned using dataflow analysis, statically. It would be interesting to see how this could be combined with dynamic analysis and visualization tools, supported by the current platform and user interface. The amount of reuse for the user interface and the component systems would increase even more.

We already parse source code and binaries, so doing static analysis would leverage that.

This would be most useful to security researches, as that requires extreme understanding of the code. This tool would do better than existing ones, because it can also use dynamic analysis of automatic and manual fuzzer recordings.