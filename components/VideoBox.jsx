import React, { useRef, useState } from 'react'
import useCamera from '../hooks/useCamera'

const maxVideoSize = 200

const VideoBox = (props) => {
  const [processing, updateProcessing] = useState(false)
  const videoElement = useRef(null)
  const canvasEl = useRef(null)
  useCamera(videoElement, maxVideoSize);

  async function onClick() {
    updateProcessing(true)

    const ctx = canvasEl.current.getContext('2d')
    ctx.drawImage(videoElement.current, 0, 0, maxVideoSize, maxVideoSize)
    const image = ctx.getImageData(0, 0, maxVideoSize, maxVideoSize)

    const buf = Module._malloc(image.length * image.BYTES_PER_ELEMENT);
    Module.HEAPU8.set(image, buf);
    Module._onNewImage(buf, videoElement.current.videoWidth, videoElement.current.videoHeight);
    const processedImage = HEAPU8.subarray(buf, buf + image.length*image.BYTES_PER_ELEMENT);
    Module._free(buf)

    // console.log(processedImage.buffer)
    // document.getElementById('my-img').src = URL.createObjectURL(
    //   new Blob([processedImage.buffer], { type: 'image/png' } /* (1) */)
    // );
    // ctx.putImageData(img, 0, 0)
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
      <video className="video" playsInline ref={videoElement} />
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
      <img id="my-img"/>
    </div>
  )
}

export default VideoBox;