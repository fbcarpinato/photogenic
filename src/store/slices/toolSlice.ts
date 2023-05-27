import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type Tool = 'brush'

interface ToolState {
  selectedTool: Tool
  wasmPath: string
}

const initialState: ToolState = {
  selectedTool: 'brush',
  wasmPath: 'wasm/draw.wasm'
}

export const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    selectTool: (state, action: PayloadAction<Tool>) => {
      state.selectedTool = action.payload
    }
  }
})

export const { selectTool } = toolSlice.actions

export default toolSlice.reducer
