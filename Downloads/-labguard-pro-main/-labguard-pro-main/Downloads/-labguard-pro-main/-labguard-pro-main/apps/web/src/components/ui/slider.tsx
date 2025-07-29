"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onValueChange, max = 100, min = 0, step = 1, className }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      onValueChange([newValue])
    }

    return (
      <div ref={ref} className={cn("relative w-full", className)}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(20 184 166) 0%, rgb(20 184 166) ${((value[0] - min) / (max - min)) * 100}%, rgba(255, 255, 255, 0.1) ${((value[0] - min) / (max - min)) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
          }}
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: linear-gradient(to right, rgb(20 184 166), rgb(34 211 238));
            border: 2px solid white;
            cursor: pointer;
          }
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: linear-gradient(to right, rgb(20 184 166), rgb(34 211 238));
            border: 2px solid white;
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider } 