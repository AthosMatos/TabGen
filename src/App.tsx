import React, { useEffect, useState } from "react";
import Canvas from "./Canvas";
import ASTARTEST from "./Canvas/indexMyAstar";


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
            {/* <ASTARTEST size={7} /> */}

        </div>
    );
}

export default App;
