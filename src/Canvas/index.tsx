import React, { useRef, useEffect } from "react";
import { CanvasProps } from "./interfaces";

const Canvas = (props: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const squareSize = 50;
    const houses = 23
    const strings = 6

    const draw = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.lineWidth = 5;

        for (let i = 0; i < 23; i++) {
            for (let j = 0; j < 6; j++) {
                if (i == 0 && j == 0) {
                    ctx.fillStyle = "red";
                    ctx.strokeStyle = "red";
                } else {
                    ctx.fillStyle = "black";
                    ctx.strokeStyle = "black";
                }
                /*  ctx.fillRect(
                     i * squareSize,
                     j * squareSize,
                     squareSize,
                     squareSize
                 ); */
                /* if (props.queensPositions && props.queensPositions[i][j] == 1) {
                    ctx.fillStyle = "red";
                    ctx.strokeStyle = "red";
                } */

                //create circles
                ctx.beginPath();
                ctx.arc(i * squareSize + squareSize / 2, j * squareSize + squareSize / 2, squareSize / 2 - 5, 0, 2 * Math.PI);
                // ctx.fill();
                ctx.stroke();
                //create squares

                /* if (props.queensPositions && props.queensPositions[i][j] == 1) {
                    //Write the Q as in Queen, bold and centered
                    ctx.font = "bold 25px Arial";

                    ctx.fillStyle = "white";
                    //add image of queen from src/images directory
                    var img = new Image();
                    img.src = require("../images/queen.png");
                    ctx.drawImage(img, i * squareSize + squareSize / 2 - 18, j * squareSize + squareSize / 2 - 18, squareSize - 15, squareSize - 15);

                    /* ctx.fillText(
                        "Q",
                        i * squareSize + squareSize / 2 - 10,
                        j * squareSize + squareSize / 2 + 10
                    ); */
            }

        }
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        draw(context);
    }, [draw]);

    return (
        <canvas
            width={houses * squareSize}
            height={strings * squareSize}
            style={{
                border: "6px solid black",
                borderRadius: "1rem"
            }}
            ref={canvasRef}
            {...props.canvasProps}
        />
    );
};

export default Canvas;
