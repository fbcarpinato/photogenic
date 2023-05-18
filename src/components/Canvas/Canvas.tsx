import React, { useEffect, useRef } from 'react'
import useWasm from '../../hooks/useWasm'

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wasm = useWasm('/wasm/draw.wasm')
  const drawScheduled = useRef(false)

  useEffect(() => {
    if (wasm == null || canvasRef.current == null) return

    const style = window.getComputedStyle(canvasRef.current)
    const width = parseInt(style.getPropertyValue('width'))
    const height = parseInt(style.getPropertyValue('height'))
    canvasRef.current.width = width
    canvasRef.current.height = height

    const initPixels = wasm.exports.init_pixels as CallableFunction
    const pixelPointer = initPixels(width, height)
    const memory = wasm.exports.memory as WebAssembly.Memory

    const updateCanvas = (): void => {
      if (
        canvasRef.current == null ||
        pixelPointer === null ||
        memory === null
      ) {
        return
      }
      const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D
      const imageData = new ImageData(
        new Uint8ClampedArray(memory.buffer, pixelPointer, width * height * 4),
        width,
        height
      )
      ctx.putImageData(imageData, 0, 0)
      drawScheduled.current = false
    }

    const drawWithBrush = (e: MouseEvent): void => {
      if (
        wasm == null ||
        canvasRef.current == null ||
        pixelPointer === null ||
        memory === null
      ) {
        return
      }

      const boundingBox = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - boundingBox.left
      const y = e.clientY - boundingBox.top
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

      if (!drawScheduled.current) {
        drawScheduled.current = true
        requestAnimationFrame(updateCanvas)
      }
    }

    canvasRef.current.addEventListener('mousemove', drawWithBrush)

    return () => {
      if (canvasRef.current != null) {
        canvasRef.current.removeEventListener('mousemove', drawWithBrush)
      }
    }
  }, [wasm, canvasRef])

  return <canvas ref={canvasRef} />
}

export default Canvas
