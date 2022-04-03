const imageDataFrom1Channel = (data, width, height) => {
  const cb = width * height * 4
  const array = new Uint8ClampedArray(cb)
  data.forEach((pixelValue, index) => {
    const base = index * 4
    array[base] = pixelValue
    array[base + 1] = pixelValue
    array[base + 2] = pixelValue
    array[base + 3] = 255
  })
  const imageData = new ImageData(array, width, height)
  return imageData
}

const imageDataFrom4Channels = (data, width, height) => {
  const array = new Uint8ClampedArray(data)
  const imageData = new ImageData(array, width, height)
  return imageData
}

const unpackImage = (module, [width, height, channels, addr]) => {
  const cb = width * height * channels
  const data = module.HEAPU8.slice(addr, addr + cb)
  return channels === 1
    ? imageDataFrom1Channel(data, width, height)
    : imageDataFrom4Channels(data, width, height)
}

export const unpackProcessImageResult = (module, addr) => {
  const NUM_INT_FIELDS = 4
  const addr32 = addr / module.HEAP32.BYTES_PER_ELEMENT
  const data32 = module.HEAP32.slice(addr32, addr32 + NUM_INT_FIELDS)
  const image = unpackImage(module, data32.slice(0, 4))
  return image;
}

export const drawOutputImage = (imageData, canvasId) => {
  const canvas = document.getElementById(canvasId)
  console.log(`[debug] drawOutputImage`)
  canvas.width = imageData.width
  canvas.height = imageData.height
  const ctx = canvas.getContext('2d')
  ctx.putImageData(imageData, 0, 0)
}


