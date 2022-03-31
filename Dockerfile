FROM trzeci/emscripten:latest


RUN apt update -y && \
    apt install git -y

RUN apt install build-essential cmake libgtk2.0-dev pkg-config \
    libavcodec-dev libavformat-dev libswscale-dev -y && \
    git clone https://github.com/opencv/opencv.git && \
    cd opencv && mkdir build && cd build && \
    cmake -D CMAKE_BUILD_TYPE=Release -D BUILD_SHARED_LIBS=NO .. && \
    cat /proc/cpuinfo | grep "processor" | wc -l | xargs make -j && \
    make install && cd ../.. && \
    rm -rf opencv

RUN mkdir -p /code

COPY . /code
WORKDIR /code

RUN npm i -g n
RUN n 14

RUN npm i --silent