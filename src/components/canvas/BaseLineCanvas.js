import React, { useRef, useEffect } from 'react'

const BaseLineCanvas = props => {
  
  const canvasRef = useRef(null)
  
  const draw = (ctx) => {
    //Color myGray = new Color(210,210,210);
		//Color myRed = new Color(255,100,100);
    var offsetX = 120;


    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	ctx.beginPath()

		ctx.fillStyle = '#D2D2D2'
		ctx.fillRect(offsetX+41, 0, 40, 25);
		ctx.fillRect(offsetX+121, 0, 40, 25);
		ctx.fillRect(offsetX-39, 0, 40, 25);
		
    ctx.fillStyle = '#FFFFFF'
		ctx.fillRect(offsetX+41+40, 0, 40, 25);
		ctx.fillRect(offsetX-119+40, 0, 40, 25);
		ctx.fillRect(offsetX-39+40, 0, 40, 25);

		drawLine(ctx, offsetX-80, 15, offsetX + 160, 15, "#000000");

    //var red = "#FF6464"
    var red = "#FF0000"

		drawLine(ctx, offsetX, 13, offsetX + 80, 13, red);
		drawLine(ctx, offsetX, 14, offsetX + 80, 14, red);
		drawLine(ctx, offsetX, 12, offsetX + 80, 12, red);

		drawLine(ctx, offsetX-20, 16, offsetX+60, 16, "#000000");
		drawLine(ctx, offsetX-20, 17, offsetX+60, 17, "#000000");
		drawLine(ctx, offsetX-20, 18, offsetX+60, 18, "#000000");
		drawLine(ctx, offsetX, 5, offsetX, 15, "#000000");
		drawLine(ctx, offsetX +80, 5, offsetX + 80, 15, "#000000");
  }

  function drawLine(ctx, x1, y1, x2, y2, color) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineWidth = 1	
    ctx.strokeStyle = color
    ctx.stroke()
  }

  function getObjectFitSize(
    contains /* true = contain, false = cover */,
    containerWidth,
    containerHeight,
    width,
    height
  ) {
    var doRatio = width / height;
    var cRatio = containerWidth / containerHeight;
    var targetWidth = 0;
    var targetHeight = 0;
    var test = contains ? doRatio > cRatio : doRatio < cRatio;
  
    if (test) {
      targetWidth = containerWidth;
      targetHeight = targetWidth / doRatio;
    } else {
      targetHeight = containerHeight;
      targetWidth = targetHeight * doRatio;
    }
  
    return {
      width: targetWidth,
      height: targetHeight,
      x: (containerWidth - targetWidth) / 2,
      y: (containerHeight - targetHeight) / 2
    };
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    var scale = window.devicePixelRatio;

    canvas.style.width = 300 + "px";
    canvas.style.height = 150 + "px";

    canvas.width = 300 * scale;
    canvas.height = 150 * scale;

    context.scale(scale, scale);
    
    //Our draw came here
    const render = () => {
      draw(context)
    }
   
    
    render()
    
    return () => {
    }
  }, [draw])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default BaseLineCanvas