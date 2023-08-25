import { useState } from "react";
import styled from "styled-components";

interface NoteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	note: string;
	CanvasNoteAnalisisRef: React.MutableRefObject<string>
	dialSequence?: boolean;
	sequenceIndex?: number;
}

const NB = styled.button<{
	isFocused: boolean;
}>`
	//change color based on index
	background-color: ${(props) => (props.isFocused ? "#ff0000" : "#4834d4")};
	border: none;
	padding: 1rem;
	border-radius: 0.6rem;
	color: white;
	cursor: pointer;
	font-size: 16px;
	font-weight: bold;
	transition: all 0.4s ease;
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);

	&:hover {
		//increase size of button
		background-color: #ff0000;
		//padding: 1.2rem;
	}

	
`;

const NoteButton = (props: NoteButtonProps) => {
	const { note, CanvasNoteAnalisisRef, dialSequence, sequenceIndex } = props;
	const [isFocused, setIsFocused] = useState(false);

	function setNoteAnalisis() {
		CanvasNoteAnalisisRef.current = note;
	}

	function resetNoteAnalisis() {
		CanvasNoteAnalisisRef.current = "";
	}

	return (
		<NB
			isFocused={isFocused}
			{...props}
			onClick={(e) => {
				setIsFocused(!isFocused);
				if (!dialSequence) {

					if (isFocused) resetNoteAnalisis();
					else setNoteAnalisis();
				}


				props.onClick && props.onClick(e);
			}}
			/* onFocus={() => {
				setIsFocused(!isFocused);
				setNoteAnalisis();
			}} */
			onBlur={(e) => {
				if (!dialSequence) {
					setIsFocused(!isFocused);
					resetNoteAnalisis();

					props.onBlur && props.onBlur(e);
				}

			}}
		>
			{`${note} ${sequenceIndex && isFocused ? `[${sequenceIndex}]` : ""}`}
		</NB>
	)
}


export default NoteButton;
