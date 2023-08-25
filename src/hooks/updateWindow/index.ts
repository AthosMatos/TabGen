import {
	useEffect,
	useRef,
	useState,
} from "react";

const useUpdateWindow = () => {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const updateWindowSize = () => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};

	useEffect(() => {
		window.addEventListener(
			"resize",
			updateWindowSize,
		);
		return () =>
			window.removeEventListener(
				"resize",
				updateWindowSize,
			);
	}, []);

	return windowSize;
};

export default useUpdateWindow;
