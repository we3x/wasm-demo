import React, { useEffect, useRef, useState } from 'react'
import useCamera from '../hooks/useCamera'
import { drawOutputImage, unpackProcessImageResult } from '../utils'

const maxVideoSize = 450

const VideoBox = (props) => {
  const videoElement = useRef(null)
  const canvasEl = useRef(null)
  const [loaded] = useCamera(videoElement, maxVideoSize);
  const options = useRef({ gray: 0,trasholded: 0, flip: 0})

  const passToWasm = (ctx) => {
    ctx.drawImage(videoElement.current, 0, 0, maxVideoSize, maxVideoSize)

    const imageData = ctx.getImageData(0, 0, maxVideoSize, maxVideoSize)

    var uintArray = imageData.data;

    const uint8_t_ptr = Module._malloc(uintArray.length);

    Module.HEAPU8.set(uintArray, uint8_t_ptr);

    const addr = Module._onNewImage(uint8_t_ptr, maxVideoSize, maxVideoSize, options.current.trasholded, options.current.flip );

    Module._free(uint8_t_ptr)

    return addr;
  }

  const processImage = () => {
    const ctx = canvasEl.current.getContext('2d')
    const addr = passToWasm(ctx)
    const processedImage = unpackProcessImageResult(Module, addr)
    drawOutputImage(processedImage, "canvas")
  }

  useEffect(() => {
    let timer;
    if (loaded) {
      timer = setInterval(() => processImage(), 200)
    }
    return () => {
      clearInterval(timer)
    }
  }, [loaded])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <video className="video" playsInline ref={videoElement}
        width={maxVideoSize}
        height={maxVideoSize}
      />
      <canvas
        id="canvas"
        ref={canvasEl}
        width={maxVideoSize}
        height={maxVideoSize}
        style={{ position: 'absolute', top: 0 }}
      ></canvas>
      <div>
        <label>Trasholded</label>
        <input type="checkbox" onChange={() => { options.current.trasholded = options.current.trasholded ? 0:1}} />
        <label>Flip</label>
        <input type="checkbox" onChange={() => { options.current.flip = options.current.flip ? 0:1}} />
      </div>
    </div>
  )
}

export default VideoBox;