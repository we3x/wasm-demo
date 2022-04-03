import React, { useRef, useState } from 'react'
import useCamera from '../hooks/useCamera'
import { drawOutputImage, unpackProcessImageResult } from '../utils'

const maxVideoSize = 450

const VideoBox = (props) => {
  const [processing, updateProcessing] = useState(false)
  const videoElement = useRef(null)
  const canvasEl = useRef(null)
  useCamera(videoElement, maxVideoSize);

  async function onClick() {
    updateProcessing(true)

    const ctx = canvasEl.current.getContext('2d')
    ctx.drawImage(videoElement.current, 0, 0, maxVideoSize, maxVideoSize)

    const imageData = ctx.getImageData(0, 0, maxVideoSize, maxVideoSize)

    var uintArray = imageData.data;

    const uint8_t_ptr = Module._malloc(uintArray.length);

    Module.HEAPU8.set(uintArray, uint8_t_ptr);

    const addr = Module._onNewImage(uint8_t_ptr, maxVideoSize, maxVideoSize);

    const processedImage = unpackProcessImageResult(Module, addr)

    Module._free(uint8_t_ptr)

    drawOutputImage(processedImage, "canvas")
    updateProcessing(false)
  }
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
      <button
        disabled={processing}
        style={{ width: maxVideoSize, padding: 10 }}
        onClick={onClick}
      >
        {processing ? 'Processing...' : 'Take a photo'}
      </button>
      <canvas
        id="canvas"
        ref={canvasEl}
        width={maxVideoSize}
        height={maxVideoSize}
      ></canvas>
      <img id="my-img" />
    </div>
  )
}

export default VideoBox;