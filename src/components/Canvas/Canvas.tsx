import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../../store/store'
import useWasm from '../../hooks/useWasm'

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawScheduled = useRef(false)

  const selectedTool = useSelector(
    (state: RootState) => state.tool.selectedTool
  )
  const wasmPath = useSelector((state: RootState) => state.tool.wasmPath)
  const wasm = useWasm(wasmPath)

  const [toolFunction, setToolFunction] = useState<(...args: any) => void>()

  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)

  const [pixelPointer, setPixelPointer] = useState<number | null>(null)
  const [memory, setMemory] = useState<WebAssembly.Memory | null>(null)

  useEffect(() => {
    import(`./tools/${selectedTool}.ts`)
      .then((module) => {
        setToolFunction(() => module.default)
        console.log(module)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [selectedTool])

  const updateCanvas = (): void => {
    if (canvasRef.current == null || pixelPointer === null || memory === null) {
      return
    }
    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D

    const width = canvasRef.current.width
    const height = canvasRef.current.height

    const imageData = new ImageData(
      new Uint8ClampedArray(memory.buffer, pixelPointer, width * height * 4),
      width,
      height
    )
    ctx.putImageData(imageData, 0, 0)
    drawScheduled.current = false
  }

  const performAction = (
    mouseEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ): void => {
    if (toolFunction != null && isMouseDown) {
      toolFunction(wasm, canvasRef, pixelPointer, memory, mouseEvent)

      if (!drawScheduled.current) {
        drawScheduled.current = true
        requestAnimationFrame(updateCanvas)
      }
    }
  }

  const resizeCanvas = (): void => {
    if (wasm == null || canvasRef.current == null) {
      return
    }

    const style = window.getComputedStyle(canvasRef.current)

    const width = parseInt(style.getPropertyValue('width'))
    const height = parseInt(style.getPropertyValue('height'))
    canvasRef.current.width = width
    canvasRef.current.height = height

    const initPixels = wasm.exports.init_pixels as CallableFunction
    const pixelPointer = initPixels(width, height)
    const memory = wasm.exports.memory as WebAssembly.Memory

    setPixelPointer(pixelPointer)
    setMemory(memory)
  }

  useEffect(() => {
    resizeCanvas()
  }, [wasm, canvasRef])

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={() => {
        setIsMouseDown(true)
      }}
      onMouseUp={() => {
        setIsMouseDown(false)
      }}
      onMouseMove={performAction}
      // eslint-disable-next-line react/no-unknown-property
      onResize={resizeCanvas}
    />
  )
}

export default Canvas
