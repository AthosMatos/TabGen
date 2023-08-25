import React, { useRef, useEffect, useState } from "react";
import { CanvasProps } from "./interfaces";
import { PosI } from "../interfaces";
import Button from "../components/Button";
import NoteButton from "../components/noteButton";
import useUpdateWindow from "../hooks/updateWindow";
import { StarNode, allNotesFromFrets, allNotesUnique, fontSize, frets, strings } from "../conts";

const Canvas = (props: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { width } = useUpdateWindow()
    const squareSizeRef = useRef(width / 26)
    const [squareSize, setSquareSize] = useState(width / 26)
    const [dialedNotes, setDialedNotes] = useState<string[]>([])
    const [dialSequence, setDialSequence] = useState<boolean>(false)
    const foundPath = useRef<[string, PosI][]>([])
    const triggerFoundPath = useRef(false)


    useEffect(() => {
        console.log(dialedNotes)
    }, [dialedNotes])

    useEffect(() => {
        setSquareSize(width / 26)
        squareSizeRef.current = width / 26
    }, [width])

    const mousePosRef = useRef({ x: 0, y: 0 })
    const CanvasNoteAnalisisRef = useRef("")
    const posCanvasAnalyis = useRef({
        string: 4 - 1,
        fret: 10,
    })

    function triggerPathFinding() {
        const NotesGrouped: StarNode[][] = [];

        dialedNotes.forEach((note, index) => {
            const node: StarNode[] = [];
            allNotesFromFrets.forEach((allNts, stringIndex) => {
                allNts.forEach((nt, fretIndex) => {
                    if (nt === note) {
                        node.push({ fret: fretIndex, string: stringIndex, note, nodeIndex: stringIndex * frets + fretIndex })

                    }
                })
            })
            NotesGrouped.push(node)
        })

        const Positions: [string, PosI][] = []
        let noteInAnalysis: PosI

        for (let i = 0; i < NotesGrouped.length - 1; i++) {
            if (NotesGrouped.length < 2) break
            const Notes = NotesGrouped[i]
            let nextNoteName = NotesGrouped[i + 1][0].note
            if (i === 0) {
                Positions.push([Notes[0].note, Notes[0]])
                noteInAnalysis = { string: Notes[0].string, fret: Notes[0].fret }

            }

            const { eachStringWeight, biggetWeight, nextPosNote } = vasculhar(noteInAnalysis!, nextNoteName)
            noteInAnalysis = nextPosNote
            Positions.push([nextNoteName, nextPosNote])

        }

        foundPath.current = Positions
    }


    function vasculhar(pos: PosI, note: string) {
        const eachStringWeight: number[][] = [];
        let biggetWeight = 0
        let nextPosNote: PosI = { string: 0, fret: 0 }
        let nextPosNotes: PosI[] = []
        let nextNoteSmallestWeight = -1

        for (let str = 0; str < strings; str++) {
            const fretWeight: number[] = []
            for (let frt = 0; frt < frets; frt++) {
                let dist = Math.pow(Math.abs(pos.string - str), 2) + Math.abs(pos.fret - frt)
                if (frt === 0) dist = 3

                fretWeight.push(dist)
                if (dist > biggetWeight) {
                    biggetWeight = dist
                }
                if (allNotesFromFrets[str][frt] === note) {
                    if (nextNoteSmallestWeight === -1) {
                        nextNoteSmallestWeight = dist
                        nextPosNote = { string: str, fret: frt }
                    }
                    else if (dist < nextNoteSmallestWeight) {
                        nextNoteSmallestWeight = dist
                        nextPosNote = { string: str, fret: frt }
                    }
                    nextPosNotes.push({ string: str, fret: frt })
                }
            }
            eachStringWeight.push(fretWeight)
        }
        return { eachStringWeight, biggetWeight, nextPosNote, nextPosNotes }
    }

    function drawTab(ctx: CanvasRenderingContext2D) {

        const { eachStringWeight, biggetWeight, nextPosNote, nextPosNotes } = vasculhar(posCanvasAnalyis.current, CanvasNoteAnalisisRef.current)

        for (let st = 0; st < strings; st++) {
            for (let frt = 0; frt < frets; frt++) {
                const x = frt * squareSizeRef.current + squareSizeRef.current / 2
                const y = st * squareSizeRef.current + squareSizeRef.current / 2

                ctx.fillStyle = "black";
                //stroke color gets greener when eachStringWeight[st][frt] is smaller
                ctx.strokeStyle = `rgb(0, ${255 + ((eachStringWeight[st][frt] / biggetWeight) * -255)}, 0)`;

                for (let i = 0; i < nextPosNotes.length; i++) {
                    if (nextPosNotes[i].fret === frt && nextPosNotes[i].string === st) {
                        ctx.strokeStyle = "orange";
                        break
                    }
                }
                if (nextPosNote.fret === frt && nextPosNote.string === st) {
                    //ctx.fillStyle = "pink";
                    ctx.strokeStyle = "blue";
                }
                if (st === posCanvasAnalyis.current.string && frt === posCanvasAnalyis.current.fret) {
                    ctx.fillStyle = "red";
                    ctx.strokeStyle = "red";
                }

                if (mousePosRef.current.x > x - squareSizeRef.current / 2 && mousePosRef.current.x < x + squareSizeRef.current / 2 && mousePosRef.current.y > y - squareSizeRef.current / 2 && mousePosRef.current.y < y + squareSizeRef.current / 2) {
                    posCanvasAnalyis.current = { string: st, fret: frt }
                }

                ctx.beginPath();
                ctx.arc(x, y, squareSizeRef.current / 2 - 5, 0, 2 * Math.PI);
                ctx.stroke();
                //font bold

                // const fontWidth = ctx.measureText(allNotesFromFrets[st][frt]).width
                const fontWidth = ctx.measureText(allNotesFromFrets[st][frt]).width + ctx.measureText(eachStringWeight[st][frt].toString()).width + 5
                //ctx.fillText(allNotesFromFrets[st][frt], frt * squareSize.current + squareSize.current / 2 - (fontWidth / 2), st * squareSize.current + squareSize.current / 2 + fontSize / 2);
                ctx.fillText(`${(eachStringWeight[st][frt]).toString()} ${allNotesFromFrets[st][frt]}`, frt * squareSizeRef.current + squareSizeRef.current / 2 - (fontWidth / 2), st * squareSizeRef.current + squareSizeRef.current / 2 + fontSize / 2);
            }
        }
    }
    function drawTabPathFound(ctx: CanvasRenderingContext2D) {
        let sequence = 0
        for (let st = 0; st < strings; st++) {
            for (let frt = 0; frt < frets; frt++) {
                let increment = false
                const x = frt * squareSizeRef.current + squareSizeRef.current / 2
                const y = st * squareSizeRef.current + squareSizeRef.current / 2

                ctx.fillStyle = "black";
                ctx.strokeStyle = 'black'
                //stroke color gets greener when eachStringWeight[st][frt] is smaller

                for (let i = 0; i < foundPath.current.length; i++) {
                    if (foundPath.current[i][1].fret === frt && foundPath.current[i][1].string === st) {
                        ctx.strokeStyle = "blue";
                        sequence++
                        increment = true
                        break
                    }
                }

                ctx.beginPath();
                ctx.arc(x, y, squareSizeRef.current / 2 - 5, 0, 2 * Math.PI);
                ctx.stroke();
                //font bold

                // const fontWidth = ctx.measureText(allNotesFromFrets[st][frt]).width

                if (increment) {
                    const fontWidth = ctx.measureText(sequence.toString()).width
                    ctx.fillText(`${sequence} `, frt * squareSizeRef.current + squareSizeRef.current / 2 - (fontWidth / 2), st * squareSizeRef.current + squareSizeRef.current / 2 + fontSize / 2)
                }
                else {
                    const fontWidth = ctx.measureText(allNotesFromFrets[st][frt]).width
                    ctx.fillText(`${allNotesFromFrets[st][frt]}`, frt * squareSizeRef.current + squareSizeRef.current / 2 - (fontWidth / 2), st * squareSizeRef.current + squareSizeRef.current / 2 + fontSize / 2);

                }

            }
        }
    }
    function drawTabClean(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "black";
        for (let st = 0; st < strings; st++) {
            for (let frt = 0; frt < frets; frt++) {
                const x = frt * squareSizeRef.current + squareSizeRef.current / 2
                const y = st * squareSizeRef.current + squareSizeRef.current / 2

                ctx.beginPath();
                ctx.arc(x, y, squareSizeRef.current / 2 - 5, 0, 2 * Math.PI);
                ctx.stroke();

                const fontWidth = ctx.measureText(allNotesFromFrets[st][frt]).width + 5
                ctx.fillText(` ${allNotesFromFrets[st][frt]}`, frt * squareSizeRef.current + squareSizeRef.current / 2 - (fontWidth / 2), st * squareSizeRef.current + squareSizeRef.current / 2 + fontSize / 2);
            }
        }
    }
    const draw = (ctx: CanvasRenderingContext2D) => {

        ctx.font = `bold ${fontSize}px Arial`;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.lineWidth = 4;

        CanvasNoteAnalisisRef.current.length ? drawTab(ctx) : triggerFoundPath.current ? drawTabPathFound(ctx) : drawTabClean(ctx)

        requestAnimationFrame(() => draw(ctx));
    }

    useEffect(() => {
        if (!canvasRef) return
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        //draw(context);
        requestAnimationFrame(() => draw(context));
    }, [canvasRef]);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "2rem"
        }}>
            <div style={{
                display: "flex",
                maxWidth: frets * squareSizeRef.current,
                flexWrap: "wrap",
                gap: "0.5rem",
            }}>
                {allNotesUnique.map((note, index) => {
                    return <NoteButton
                        CanvasNoteAnalisisRef={CanvasNoteAnalisisRef}
                        key={index}
                        note={note}
                        dialSequence={dialSequence}
                        sequenceIndex={dialedNotes.indexOf(note) + 1}
                        onClick={() => {
                            if (dialSequence) {
                                setDialedNotes([...dialedNotes, note])
                            }

                        }}
                        onBlur={() => {
                            if (!dialSequence) {
                                setDialedNotes([])
                            }
                        }
                        }
                    />


                })}
            </div>

            <canvas
                width={frets * squareSize}
                height={strings * squareSize}
                style={{
                    border: "6px solid black",
                    borderRadius: "1rem"
                }}
                onMouseMove={(e) => {
                    mousePosRef.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
                }}
                ref={canvasRef}
                {...props.canvasProps}
            />
            <div style={{
                display: "flex",
                gap: "1rem"
            }}>
                <Button
                    dialSequence={dialSequence}
                    text="triggerPathFinding"
                    onClick={() => {
                        triggerPathFinding()
                        triggerFoundPath.current = true
                    }} />
                <Button
                    dialSequence={dialSequence}
                    text="Dial Sequence"
                    onClick={() => {
                        setDialSequence(!dialSequence)
                    }} />
                {
                    foundPath.current.map((note, index) => {
                        return <p>
                            {note[0]} {note[1].string} {note[1].fret}
                        </p>
                    })
                }
            </div>
        </div>
    );
};

export default Canvas;
