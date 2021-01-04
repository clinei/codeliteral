### TotalView

Website: https://totalview.io/
Video:   https://totalview.io/video-tutorials/reverse-debugging
Target:  Python, C, C++, Fortran
Active:  Very, HPC
Price:   $600 to $900

Features:
+ Multi-core
+ Scriptpoints
+ Continue to breakpoint

### Mozilla Firefox

Website: https://developer.mozilla.org/en-US/docs/Mozilla/Projects/WebReplayRoadmap
Video:   https://www.youtube.com/watch?v=rDq1AN1kSn4
Target:  Javascript, Web
Active:  Yes, early stages
Price:   Free

Features:
+ Scrolling with mouse
+ Tracepoints
+ Continue to breakpoint
+ Console

### Dynatrace

Website: https://www.dynatrace.com/
Video:   https://www.youtube.com/watch?v=FOncwehUda0
Target:  Everything, Web, Microservices
Price:   

Features:
+ Massive platform support, wide integration
+ Bytecode instrumentation
+ Central server
+ Filtering of traces
+ End-to-end tracing
+ Full parameter data, maybe even variable data?
+ Can send file to a coworker
+ Sliding program evolution
+ Multi-core, multi-process, multi-computer
+ User session analysis

Disadvantages:
- Complex UI
- Not extensible?
- Not for analyzing the low-level code, but the high-level events and transactions

### CodeSonar

Website: https://www.grammatech.com/products/codesonar
Video:   https://www.youtube.com/watch?v=EqDhtRoorGU
Target:  
Price:   

Features:
+ Static analysis only
+ Memory leak detection
+ Call graph

### PySnooper

Website: https://github.com/cool-RR/PySnooper
Video:   https://www.youtube.com/watch?v=XP5imOJc_TE
Target:  Python
Active:  Yes, more of a toy
Price:   Free

Features:
+ Show only the lines that were executed, repeated, but without namespace fixes
+ Console
+ Tracepoints
+ Value change result is shown

Disadvantages:
- Code needs to be modified
- Value use result is not shown
- Not interactive
- Not using the same grammar as the base language
- No scripting support

Weaknesses:
* Based on sys.settrace, which can only see function enter and exit, and line and exception, but not individual code elements

### bpftrace

Website: https://github.com/iovisor/bpftrace

### C# Tracepoints

Website: https://web.archive.org/web/20190109221722/https://blogs.msdn.microsoft.com/devops/2013/10/10/tracepoints/

Features:
+ Post-compilation printf

### WinDbg TTD

Website: https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/time-travel-debugging-overview
Video:   https://www.youtube.com/watch?v=l1YJTg_A914
Target:  

Features:
+ Multi-core

### MULTI debugger / TimeMachine

Website: https://www.ghs.com/video/index.html#debugging
Target:  C/C++, RTOS
Active:  Yes
Price:   rumors say $10,000 or $6,000 per year, custom licensing

Features:
+ Tracepoints
+ Find References, both Read and Write
+ Detailed OS integration
+ Thread and OS event analyzer
+ Program Visualization
+ Full execution history
+ Offline debugging with Flame Graph

### Chronon

Website: http://chrononsystems.com/products/chronon-time-travelling-debugger#features
Target:  Java, Eclipse
Active:  No longer developed
Price:   $59 per year for personal use, $239 per year for company, free for non-commercial use

Features:
+ Tracepoints
+ Full execution history
+ Exception history and trail
+ Time bookmarks aka flowpoints
+ Save to file and share with team

### Light Table

Website: http://lighttable.com/
Target:  Mainly Javascript, comes with custom text editor
Active:  Lone developer, slow, already switched maintainers
Price:   Completely free

Features:
+ Real-time feedback

### OzCode

Website: https://oz-code.com/features/
Target:  C#, Visual Studio
Active:  Very
Price:   $100 per year for personal, $295 per year for company, $20 for academic, lots of free promotion discounts

Features:
+ Tracepoints
+ Fade code that was not run
+ Deep data member and array search, realtime
+ Expression evaluation and result display, top or bottom of expression but not replace
+ Struct member access breakpoint
+ Exception trail

### CodeRush

Website: https://www.devexpress.com/products/coderush/
Target:  C#, Visual Studio
Active:  Yes
Price:   $49 for basic, $249 for tech support, $1,499 for GUI toolkit and libraries, $2,199 for enterprise

Features:
+ Expression evaluation and result display, tree view
+ Fade code that was not run
+ A bunch of refactoring and navigation tools and missing feature fixes
+ Various small tools that should not exist