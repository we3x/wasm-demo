#include <emscripten/emscripten.h>
#include <emscripten/val.h>

#include <opencv2/opencv.hpp>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/imgproc.hpp>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

using namespace cv;
using namespace std;

extern "C" {
    void onNewImage(uchar *data, int width, int height) {
        Mat image(height, width, CV_8UC4);
        image.data = data;
        cvtColor(image, image, COLOR_BGR2GRAY);
    }
}