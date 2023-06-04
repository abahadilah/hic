import React, { useRef, useEffect } from 'react'

const TithiCanvas = props => {
  
  const canvasRef = useRef(null)
  
  const draw = (ctx) => {
      var f0 = parseInt(props.data.frac0);
      var f1 = parseInt(props.data.frac1);
      var f2 = parseInt(props.data.frac2);
      var f3 = parseInt(props.data.frac3);
      var f4 = parseInt(props.data.frac4);
      var t0 = props.data.tit0;
      var t1 = props.data.tit1;
      var t2 = props.data.tit2;
      var t3 = props.data.tit3;
      var t4 = props.data.tit4;
      var msg = props.data.message;
      var msg1 = props.data.message1;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
    ctx.beginPath()


    var offsetX = 120-1;

    ctx.fillStyle = '#D2D2D2'
		ctx.fillRect(offsetX+42, 0, 40,32);
		ctx.fillRect(offsetX+122, 0, 40,32);
		ctx.fillRect(offsetX-38, 0, 40, 32);

    ctx.fillStyle = '#FFFFFF'
		ctx.fillRect(offsetX+42+40, 0, 40,32);
		ctx.fillRect(offsetX-118+40, 0, 40,32);
    ctx.fillRect(offsetX-38+40, 0, 40, 32);

		drawLine(ctx, offsetX+f1, 15, offsetX + f2, 15, '#000000');
		drawLine(ctx, offsetX+f1, 16, offsetX + f2, 16, '#FF0000');

		drawLine(ctx, offsetX+f2, 15, offsetX + f3, 15, '#000000');
		drawLine(ctx, offsetX +f1, 15, offsetX + f1, 18, '#000000');
		drawLine(ctx, offsetX +f2, 15, offsetX + f2, 18, '#000000');
		drawLine(ctx, offsetX +f3, 15, offsetX + f3, 18, '#000000');
		if (f0 != -500) {
			drawLine(ctx, offsetX +f0, 15, offsetX + f0, 13, '#000000');
			drawLine(ctx, offsetX +f4, 15, offsetX + f4, 13, '#000000');
		}

    ctx.font = "normal 10px Noto Serif";
    ctx.fillStyle = '#000000'

    ctx.fillText(t1, 110+f1, 12);
		ctx.fillText(t2, 110+f2, 12);
		ctx.fillText(t3, 110+f3, 12);
		ctx.fillText(t0, 110+f0, 12);
		ctx.fillText(t4, 110+f4, 12);
		ctx.fillText(msg, 119+f1, 25);
		ctx.fillText(msg1, 121+f2, 25);

    ctx.fill()
  }

  function drawLine(ctx, x1, y1, x2, y2, color) {
    ctx.beginPath()
    ctx.lineWidth = 0.75
    ctx.strokeStyle = color
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
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
      
      if (typeof props.data !== 'undefined') {        

        draw(context)
      }
    }
    render()
    
    return () => {
    }
  }, [draw])
  
  return <canvas style={{height: 150, width: 300}} ref={canvasRef} {...props}/>
}

export default TithiCanvas