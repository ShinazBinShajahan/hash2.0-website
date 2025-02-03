"use client"
import { useEffect, useRef, useState } from "react"

interface TextPressureProps {
  text?: string
  fontFamily?: string
  fontUrl?: string
  width?: boolean
  weight?: boolean
  italic?: boolean
  alpha?: boolean
  flex?: boolean
  stroke?: boolean
  scale?: boolean
  textColor?: string
  strokeColor?: string
  className?: string
  minFontSize?: number
}

const TextPressure: React.FC<TextPressureProps> = ({
  text = "College Events",
  fontFamily = "Chakra Petch",
  fontUrl = "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&display=swap",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#dc2626", // text-red-600
  strokeColor = "#FF0000",
  className = "",
  minFontSize = 24,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const spansRef = useRef<HTMLSpanElement[]>([])
  const [fontSize, setFontSize] = useState(minFontSize)
  const [lineHeight, setLineHeight] = useState(1)
  const [scaleY, setScaleY] = useState(1)
  const chars = text.split("")

  useEffect(() => {
    let observer: ResizeObserver
    if (containerRef.current && titleRef.current) {
      observer = new ResizeObserver(() => {
        const { width } = containerRef.current.getBoundingClientRect()
        const { width: textWidth } = titleRef.current.getBoundingClientRect()
        const scale = Math.min(1, width / textWidth)
        setFontSize(minFontSize * scale)
        setScaleY(scale)
        setLineHeight(1 / scale)
      })
      observer.observe(containerRef.current)
    }
    return () => observer?.disconnect()
  }, [minFontSize, text])

  const dynamicClassName = [
    className,
    "text-2xl md:text-3xl lg:text-4xl font-bold text-red-600 mb-8",
    flex ? "flex" : "",
    stroke ? "stroke" : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      <style>{`
        @import url('${fontUrl}');

        .flex {
          display: flex;
        }

        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }
      `}</style>

      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: "uppercase",
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "center top",
          margin: 0,
          textAlign: "center",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontWeight: 700, // Changed to match 'font-bold'
          width: "100%",
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            data-char={char}
            style={{
              display: "inline-block",
              color: stroke ? undefined : textColor,
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  )
}

export default TextPressure

