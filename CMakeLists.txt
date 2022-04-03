set(OPENCV_DIR "/src/opencv")

cmake_minimum_required(VERSION 3.1)

# Use C++ 11 by default
set(CMAKE_CXX_STANDARD 11)

# Set Release as default build type
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif(NOT CMAKE_BUILD_TYPE)

# Does not work
# find_package(OpenCV REQUIRED PATHS "${OPENCV_DIR}/build_wasm" NO_DEFAULT_PATH)

# Needed for opencv2/opencv.hpp
include_directories("${OPENCV_DIR}/include")

# Needed by opencv.hpp for opencv2/opencv_modules.hpp
include_directories("${OPENCV_DIR}/build_wasm")

# Needed by opencv_modules.hpp for every module
file(GLOB opencv_include_modules "${OPENCV_DIR}/modules/*/include")
include_directories(${opencv_include_modules})

# Our hello world executable
add_executable(main wasm/main.cpp)

# Link to opencv.js precompiled libraries
file(GLOB opencv_libs "${OPENCV_DIR}/build_wasm/lib/*.a")
target_link_libraries(main ${opencv_libs})

# There is an issue regarding the order in which libraries
# are passed to the compiler - pass libopencv_core.a last
# https://answers.opencv.org/question/186124/undefined-reference-to-cvsoftdoubleoperator/
file(GLOB opencv_lib_core "${OPENCV_DIR}/build_wasm/lib/libopencv_core.a")
target_link_libraries(main ${opencv_lib_core})

# Specify linker arguments
set_target_properties(main PROPERTIES LINK_FLAGS "-s EXPORTED_RUNTIME_METHODS=['ccall'] -s EXPORTED_FUNCTIONS=['_onNewImage'] -s WASM=1 -s ASSERTIONS=1 -s ALLOW_MEMORY_GROWTH=1")