#!/bin/bash
emcc debug.c util.c interaction.c renderer.c parser.c run.c debugger.c -o debugger.js -O0 -g4 -lGLESv2 -lEGL -s USE_WEBGL2=1 -s SAFE_HEAP=1 -s ALLOW_MEMORY_GROWTH=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap', 'writeAsciiToMemory', 'writeArrayToMemory']" --source-map-base http://localhost:6931/ --preload-file assets -Wno-incompatible-pointer-types