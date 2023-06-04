import React, { useRef, useEffect } from 'react'

const PlanetCanvas = props => {
  
  const canvasRef = useRef(null)
  
  const draw = (ctx) => {

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	ctx.beginPath()

	ctx.fillStyle = "#FFFF64"
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    var pi6 = Math.PI/6;
		var pi25 = Math.PI/25;
		var pi30 = Math.PI/30;

    var x;
    var y;
		var r = 75 
    var off=2;
		// Main diagram

    ctx.fillStyle = '#000000'
	drawOval(ctx, off, off, 2*r+off, 2*r+off, "#000000");
	
	drawLine(ctx, 62+off, 1+off, 62+off, 149+off, "#000000");//62=83,149=199
	drawLine(ctx, 88+off, 1+off, 88+off, 149+off, "#000000");//88=117
	drawLine(ctx, 1+off, 62+off, 149+off, 62+off, "#000000");//127=170
	drawLine(ctx, 1+off, 88+off, 149+off, 88+off, "#000000");//22=30
	drawLine(ctx, 62+off, 88+off, 22+off, 128, "#000000");//ne
	drawLine(ctx, 62+off, 62+off, 22+off, 22+off, "#000000");//nw
	drawLine(ctx, 88+off, 62+off, 127+off, 22+off, "#000000");//sw
	drawLine(ctx, 88+off, 88+off, 127+off, 127+off, "#000000");//se
	
	ctx.font = "normal 10px Noto Serif";
	ctx.fillStyle = '#FF0000'

	//Insert the planets
	x = parseInt((-55 * Math.cos(props.angle[0] * pi6 - pi25) + r+off + 3));		//55=73
	y = parseInt((-55 * Math.sin(props.angle[0] * pi6 - pi25) + r+off - 3));
	ctx.fillText("1", y, x);//Sun
	
	x = parseInt((-49 * Math.cos(props.angle[1] * pi6 - pi25) + r+off + 3));	//49=65	
	y = parseInt((-49 * Math.sin(props.angle[1] * pi6 - pi25) + r+off - 3));
	ctx.fillText("2", y, x);//Moon
	
	x = parseInt((-59 * Math.cos(props.angle[2] * pi6) + r+off + 3));//59=79		
	y = parseInt((-59 * Math.sin(props.angle[2] * pi6) + r+off - 3));
	ctx.fillText("3", y, x);//Mars
	
	x = parseInt((-51 * Math.cos(props.angle[3] * pi6) + r+off + 3));	//51=68	
	y = parseInt((-51 * Math.sin(props.angle[3] * pi6) + r+off - 3));
	ctx.fillText("4", y, x);//Mercury
	
	x = parseInt((-66 * Math.cos(props.angle[4] * pi6 - pi25) + r+off + 5));//66=88		
	y = parseInt((-66 * Math.sin(props.angle[4] * pi6 - pi25) + r+off - 3));
	ctx.fillText("5", y, x);//Juputer
	
	x = parseInt((-50 * Math.cos(props.angle[5] * pi6 + pi25) + r+off + 3));	//50=67	
	y = parseInt((-50 * Math.sin(props.angle[5] * pi6 + pi25) + r+off - 3));
	ctx.fillText("6", y, x);//Venus
	
	x = parseInt((-66 * Math.cos(props.angle[6] * pi6) + r+off + 3));		
	y = parseInt((-66 * Math.sin(props.angle[6] * pi6) + r+off - 3));
	ctx.fillText("7", y, x);//Saturn

    ctx.fill()
  }

  function drawOval(context, startX, startY, endX, endY, strokeColor) {

    var rx = (endX - startX) * 0.5,  // get radius for x 
        ry = (endY - startY) * 0.5,  // get radius for y
        cx = startX + rx,            // get center position for ellipse
        cy = startY + ry,
        a = 0,                       // current angle
        step = 0.01,                 // angle step
        pi2 = Math.PI * 2;

    context.beginPath();
    context.strokeStyle = strokeColor;
    context.moveTo(cx + rx, cy);     // initial point at 0 deg.

    for(; a < pi2; a += step)
        context.lineTo(cx + rx * Math.cos(a), // create ellipse path
                       cy + ry * Math.sin(a));

    context.closePath();             // close for stroke
    context.stroke();

}


  function drawLine(ctx, x1, y1, x2, y2, color) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineWidth = 1
    ctx.strokeStyle = color
    ctx.stroke()
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
 
    var scale = window.devicePixelRatio;
    var width = 153
    var height = 153

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    canvas.width = width * scale;
    canvas.height = height * scale;

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

export default PlanetCanvas