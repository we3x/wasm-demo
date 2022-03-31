EMCC = emcc
SOURCES = wasm/main.cpp 
DIST = ./public

EMFLAGS = -s EXPORTED_FUNCTIONS="['_sum']" 
CV2FLAGS = -I/usr/local/include/opencv4

build: $(SOURCES)
	$(EMCC) $(EMFLAGS) $(SOURCES) ${LFLAGS} -o $(DIST)/wasm.js ${CV2FLAGS}

binary: $(SOURCES)
	$(CC) $(SOURCES) -o $(DIST)/wasm