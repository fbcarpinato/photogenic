import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrush, faEraser, faImage } from '@fortawesome/free-solid-svg-icons'

interface ToolboxItemProps {
  icon: any
  title: string
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ icon, title }) => (
  <div className="flex items-center gap-2 p-2 mb-2 hover:bg-gray-200 rounded cursor-pointer">
    <FontAwesomeIcon icon={icon} size="1x" />
    <span>{title}</span>
  </div>
)

const Toolbar: React.FC = () => (
  <div className="h-full border-r-2 border-gray-200 p-4">
    <h2 className="mb-4 text-lg font-bold">Toolbox</h2>
    <ToolboxItem icon={faBrush} title="Brush" />
    <ToolboxItem icon={faImage} title="Image" />
    <ToolboxItem icon={faEraser} title="Eraser" />
    {/* Add more tools here */}
  </div>
)

export default Toolbar
