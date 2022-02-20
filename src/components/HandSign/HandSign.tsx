import React, { useState, useRef, useEffect, CSSProperties } from "react";
import Icon from "components/Icon/Icon";
import drawCurve from "./draw";

const wrapperStyles: CSSProperties = {
  overflow: "hidden",
  position: "relative",
  paddingLeft: "3rem",
  // border: '1px solid #000',
  boxShadow: "0 1px 2px 1px rgba(18, 18, 18, .125)",
  display: "inline-block",
  backgroundColor: "#ededed",
  borderRadius: ".25rem",
};
const commonBtnStyles: CSSProperties = {
  position: "absolute",
  height: "2.5rem",
  width: "2.5rem",
  textAlign: "center",
  padding: "0rem",
  borderRadius: "50%",
  border: "2px solid rgba(24, 24, 24, .3)",
  boxShadow:
    "0px -1px rgba(24, 24, 24, .125), 1px 1px rgba(24, 24, 24, .125), -1px 2px rgba(24, 24, 24, .125), 0px 2px rgba(24, 24, 24, .125)",
  outline: 0,
  left: "0.25rem",
};
const iconStyles: CSSProperties = {
  verticalAlign: "middle",
  color: "white",
};

export interface HandSignProps
  extends Pick<
    CanvasRenderingContext2D,
    "lineCap" | "lineJoin" | "lineWidth" | "imageSmoothingQuality"
  > {
  onValidateSignature: (drawingData: { imgURL: string }) => void;
  height: HTMLCanvasElement["height"];
  width: HTMLCanvasElement["width"];
  minDistanceBetweenTwoPoints: number;
  backgroundColor: CSSProperties["backgroundColor"];
  validBtnBackground: CSSProperties["backgroundColor"];
  resetBtnBackground: CSSProperties["backgroundColor"];
  exportMIME: string;
}
export function HandSign({
  onValidateSignature,
  height,
  width,
  minDistanceBetweenTwoPoints,
  backgroundColor,
  validBtnBackground,
  resetBtnBackground,
  exportMIME,
  lineCap,
  lineJoin,
  lineWidth,
  imageSmoothingQuality,
}: HandSignProps & typeof HandSign.defaultProps) {
  const [date, setDate] = useState<number | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [points, setPoints] = useState<{ x: number; y: number }[][]>([]);
  const [segment, setSegment] = useState<{ x: number; y: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const contextOpts: Pick<
    CanvasRenderingContext2D,
    "lineCap" | "lineJoin" | "lineWidth" | "imageSmoothingQuality"
  > = {
    lineCap,
    lineJoin,
    lineWidth,
    imageSmoothingQuality,
  };

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
    }
    if (ctx.current) {
      for (let opt in contextOpts) {
        // @ts-ignore
        ctx.current[opt] = contextOpts[opt];
      }
      ctx.current.fillStyle = backgroundColor;
      ctx.current.fillRect(0, 0, width, height);
    }
  }, []);

  const validateSignature = () => {
    const onAccessGranted: PositionCallback = function (locationInfos) {
      if (ctx.current) {
        const { current } = ctx;
        setDate(Date.now());
        current.save();
        current.font = "18px monospace";
        current.lineWidth = 0;
        current.fillStyle = "rgb(24, 24, 24)";
        current.fillText(
          new Date(Date.now()).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            // hour: '2-digit',
            // minute: '2-digit'
          }),
          10,
          20,
          parseInt(String(width / 3))
        );

        current.restore();
      }

      if (canvasRef.current && typeof onValidateSignature == "function") {
        onValidateSignature({
          imgURL: canvasRef.current.toDataURL(exportMIME),
        });
      }
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onAccessGranted);
    }
  };
  const resetDrawArea = () => {
    setPoints([]);
    if (ctx.current) {
      ctx.current.fillStyle = backgroundColor;
      ctx.current.fillRect(0, 0, width, height);
    }
  };

  useEffect(() => {
    if (!active && points.length && ctx.current) {
      ctx.current.fillStyle = backgroundColor;
      ctx.current.fillRect(0, 0, width, height);
      points.forEach((segment) => {
        if (ctx.current) {
          drawCurve(ctx.current, segment);
        }
      });
    }
    return () => {};
  }, [active]);

  const handleMouse = (
    mouseEvent:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const { type } = mouseEvent;
    const onMouseUp = function () {
        setActive(false);
        const newSegment = [...segment];
        const newPoints = [...points];
        newPoints.push(newSegment);
        setPoints(newPoints);
        setSegment([]);
      },
      onMouseDown = function () {
        setActive(true);
        if (ctx.current) {
          ctx.current.beginPath();
        }
      },
      onMouseMove = function () {
        if (!canvasRef.current) return;

        const drawSegment = function (points: { x: number; y: number }[]) {
          if (!ctx.current) return;

          if (points.length < 6) {
            const b = points[0];
            if (b && typeof b.x === "number" && typeof b.y === "number")
              ctx.current.beginPath(),
                ctx.current.arc(
                  b.x,
                  b.y,
                  contextOpts.lineWidth / 2,
                  0,
                  Math.PI * 2,
                  !0
                ),
                ctx.current.closePath(),
                ctx.current.fill();
            return;
          }
          ctx.current.beginPath(), ctx.current.moveTo(points[0].x, points[0].y);
          // draw a bunch of quadratics, using the average of two points as the control point
          let i;
          const n = points.length;
          for (i = 1; i < n - 2; i++) {
            const c = (points[i].x + points[i + 1].x) / 2,
              d = (points[i].y + points[i + 1].y) / 2;
            ctx.current.quadraticCurveTo(points[i].x, points[i].y, c, d);
          }
          ctx.current.quadraticCurveTo(
            points[i].x,
            points[i].y,
            points[i + 1].x,
            points[i + 1].y
          ),
            ctx.current.stroke();
        };

        if (active) {
          // const coordinates: { x: number; y: number } = mouseTouchOffset(
          //   mouseEvent.nativeEvent
          // );

          // console.log(mouseEvent);

          const {
            top,
            left,
            right,
            height,
            ...rest
          } = canvasRef.current.getBoundingClientRect();

          const coordinates: { x: number; y: number } | null =
            "touches" in mouseEvent && mouseEvent.touches[0] instanceof Touch
              ? {
                  x: Math.max(mouseEvent.touches[0].clientX - left, 0),
                  y: Math.max(mouseEvent.touches[0].clientY - top),
                }
              : "clientX" in mouseEvent
              ? {
                  x: Math.max(mouseEvent.clientX - left, 0),
                  y: Math.max(mouseEvent.clientY - top),
                }
              : null;

          if (!coordinates) return;

          const lastPoint = segment[segment.length - 1];

          const newSegment = [...segment];

          if (
            lastPoint &&
            Math.abs(
              Math.sqrt(
                Math.pow(coordinates.x - lastPoint.x, 2) +
                  Math.pow(coordinates.y - lastPoint.y, 2)
              )
            ) < minDistanceBetweenTwoPoints
          ) {
            return;
          }

          newSegment.push(coordinates);

          if (newSegment.length > 0) {
            setSegment(newSegment);

            drawSegment(segment);
          }
        }
      };

    if (type == "mousemove" || type == "touchmove") {
      onMouseMove();
    }
    if (
      type == "mouseup" ||
      type == "mouseleave" ||
      type == "touchend" ||
      type == "touchcancel"
    )
      onMouseUp();
    if (type == "mousedown" || type == "touchstart") {
      onMouseDown();
    }
  };

  return (
    <div style={wrapperStyles}>
      <canvas
        onTouchStart={handleMouse}
        onTouchMove={handleMouse}
        onTouchEnd={handleMouse}
        onTouchCancel={handleMouse}
        onMouseDown={handleMouse}
        onMouseMove={handleMouse}
        onMouseLeave={handleMouse}
        onMouseUp={handleMouse}
        ref={canvasRef}
        height={height}
        width={width}
        style={{ display: "block", height, width }}
      />
      <button
        style={{
          ...commonBtnStyles,
          backgroundColor: resetBtnBackground,
          top: ".25rem",
        }}
        onClick={resetDrawArea}
      >
        <Icon name="eraser" size="lg" />
      </button>
      <button
        style={{
          ...commonBtnStyles,
          backgroundColor: validBtnBackground,
          top: "3.25rem",
        }}
        onClick={validateSignature}
      >
        <Icon name="check" size="lg" />
      </button>
    </div>
  );
}

HandSign.defaultProps = {
  height: 200,
  width: 500,
  minDistanceBetweenTwoPoints: 1,
  backgroundColor: "white",
  validBtnBackground: "lightseagreen",
  resetBtnBackground: "cornflowerblue",
  exportMIME: "image/png",
  lineCap: "round",
  lineJoin: "round",
  lineWidth: 4,
  imageSmoothingQuality: "high",
};

export default HandSign;
