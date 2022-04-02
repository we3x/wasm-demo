#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <opencv2/opencv.hpp>
#include <emscripten/emscripten.h>

extern "C" {
    void sum() {
        printf("REBUILD LOADED!\n");
        srand ( time(NULL) );
        printf("%d\n", rand());
    }
}