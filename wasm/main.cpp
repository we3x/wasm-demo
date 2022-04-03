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
    int* returnImage(Mat image){

        int return_image_width = image.cols;
        int return_image_height = image.rows;
        int return_image_channels = image.channels();
        int return_image_size = return_image_width * return_image_height * return_image_channels;
        int return_data_size = 4*sizeof(int) + return_image_size;

        int *return_data = static_cast<int*>(malloc(return_data_size));
        uchar *return_image_addr = reinterpret_cast<uchar*>(&return_data[4]);

        return_data[0] = return_image_width;
        return_data[1] = return_image_height;
        return_data[2] = return_image_channels;
        return_data[3] = reinterpret_cast<int>(return_image_addr);
        memcpy(return_image_addr, image.data, return_image_size);

        return return_data;

    }
    int* onNewImage(uchar *data, int width, int height) {

        Mat image(height, width, CV_8UC4, data);
        Mat matNormalised;
        cvtColor(image, matNormalised, COLOR_RGB2GRAY);

        return returnImage(matNormalised);
    }
}