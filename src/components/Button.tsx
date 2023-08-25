import { useState } from "react";
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
	dialSequence: boolean;
}

const BT = styled.button<{
	isFocused: boolean;
}>`
	background-color:  ${(props) => (props.isFocused ? "#ff0000" : "#6c5ce7;")};
	border: none;
	padding: 1rem;
	border-radius: 0.6rem;
	color: white;
	cursor: pointer;
	font-size: 16px;
	font-weight: bold;
	transition: all 0.2s ease;
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);

	&:hover {
		background-color: #cc5050;
		//padding: 1.2rem;
	}
`;

const Button = (props: ButtonProps) => {
	const { text, dialSequence } = props;
	const [isFocused, setIsFocused] = useState(false);


	return (
		<BT
			isFocused={isFocused}
			{...props}
			onClick={(e) => {
				setIsFocused(!isFocused);


				props.onClick && props.onClick(e);
			}}
			/* onFocus={() => {
				setIsFocused(!isFocused);
				setNoteAnalisis();
			}} */
			onBlur={() => {
				if (!dialSequence) setIsFocused(!isFocused);
				//resetNoteAnalisis();
			}}
		>
			{text}
		</BT>
	)
}


export default Button;
