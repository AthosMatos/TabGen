import React, { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { PosI } from "./interfaces";
import { Edge, dijkstra } from "./disk";

/*
   ->[2]
[0]->[1] 
*/


const graph: Edge[][] = [
    [
        { target: 1, weight: 4 },
        { target: 2, weight: 1 }
    ],//0
    [
        { target: 2, weight: 3 },
        { target: 3, weight: 2 },
        { target: 4, weight: 3 }
    ],//1
    [{ target: 4, weight: 5 }],//2
    [{ target: 5, weight: 6 }],//3
    [
        { target: 3, weight: 1 },
        { target: 5, weight: 2 }
    ],//4
];

const startVertex = 0;
const shortestDistances = dijkstra(graph, startVertex);

console.log("Shortest distances from vertex", startVertex);
for (let i = 0; i < shortestDistances.length; i++) {
    console.log(`Vertex ${i}: ${shortestDistances[i]}`);
}


function App() {



    return (
        <div
            style={{
                display: "flex",
                width: "100vw",
                height: "100vh",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "2rem"
            }}
        >
            <Canvas size={7} />

        </div>
    );
}

export default App;
