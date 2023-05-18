import { useEffect, useState } from 'react'

const useWasm = (url: string): WebAssembly.Instance | null => {
  const [wasm, setWasm] = useState<WebAssembly.Instance | null>(null)

  useEffect(() => {
    const fetchAndInstantiateWasm = async (): Promise<void> => {
      try {
        const module = await WebAssembly.instantiateStreaming(fetch(url))
        setWasm(module.instance)
      } catch (e) {
        console.log(e)
      }
    }

    fetchAndInstantiateWasm().catch(() => {})
  }, [url])

  return wasm
}

export default useWasm
