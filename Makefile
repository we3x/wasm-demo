EMCC = emcc
SOURCES = src_wasm/main.c src_wasm/tinyexpr.c
DIST = public/dist
LFLAGS = -lm

EMFLAGS = -s EXPORTED_FUNCTIONS="['_sum']" 

build: $(SOURCES)
	$(EMCC) $(EMFLAGS) $(SOURCES) ${LFLAGS} -o $(DIST)/hello.js

binary: $(SOURCES)
	$(CC) $(SOURCES) -o $(DIST)/hello
