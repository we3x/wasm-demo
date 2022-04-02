FROM trzeci/emscripten:latest

RUN apt update -y && \
    apt install git -y

RUN git clone https://github.com/opencv/opencv.git

RUN cd opencv && python ./platforms/js/build_js.py build_wasm --build_wasm

RUN apt install build-essential cmake libgtk2.0-dev pkg-config \
    libavcodec-dev libavformat-dev libswscale-dev -y

RUN cd /src/opencv/ && mkdir build && cd build && \
    cmake -D CMAKE_BUILD_TYPE=Release -D BUILD_SHARED_LIBS=NO .. && \
    cat /proc/cpuinfo | grep "processor" | wc -l | xargs make -j && \
    make install 


RUN mkdir -p /code

COPY . /code
WORKDIR /code