const drawWithBrush = (
  wasm: any,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  pixelPointer: number,
  memory: WebAssembly.Memory,
  mouseEvent: MouseEvent
): void => {
  if (
    wasm == null ||
    canvasRef.current == null ||
    pixelPointer === null ||
    memory === null
  ) {
    return
  }

  const boundingBox = canvasRef.current.getBoundingClientRect()
  const x = mouseEvent.clientX - boundingBox.left
  const y = mouseEvent.clientY - boundingBox.top
  const scale = canvasRef.current.width / boundingBox.width
  const scaledX = Math.floor(x * scale)
  const scaledY = Math.floor(y * scale)
  const width = canvasRef.current.width
  const height = canvasRef.current.height

  const createColor = wasm.exports.create_color as CallableFunction
  const freeColor = wasm.exports.free_color as CallableFunction
  const draw = wasm.exports.draw as CallableFunction
  const colorPtr = createColor(0, 0, 0, 255)
  draw(pixelPointer, width, height, scaledX, scaledY, colorPtr)
  freeColor(colorPtr)
}

export default drawWithBrush
