export type StarNode = {
	fret: number; //x
	string: number; //y
	note: string; //name
	nodeIndex: number; //index
	edges: StarEdge[]; //conexions
};

export type StarEdge = {
	targetIndex: number;
	targetNote?: string;
	weight: number;
};

function heuristic(
	Nod: StarNode,
	goal: StarNode,
): number {
	// This is a simple Manhattan distance heuristic
	return (
		Math.abs(Nod.fret - goal.fret) +
		Math.abs(Nod.string - goal.string)
	);
}

export function aStar(
	nodes: StarNode[],
	startIdx: number,
	goalIdx: number,
): number[] {
	const n = nodes.length;
	const openSet = new Set<number>();
	const gScore = new Array<number>(n).fill(
		Number.MAX_VALUE,
	);
	const fScore = new Array<number>(n).fill(
		Number.MAX_VALUE,
	);
	const cameFrom: number[] = [];

	gScore[startIdx] = 0;
	fScore[startIdx] = heuristic(
		nodes[startIdx],
		nodes[goalIdx],
	);
	openSet.add(startIdx);

	while (openSet.size > 0) {
		let current: number | null = null;
		let currentFScore = Number.MAX_VALUE;
		for (const Nod of openSet) {
			if (fScore[Nod] < currentFScore) {
				current = Nod;
				currentFScore = fScore[Nod];
			}
		}

		if (current === goalIdx) {
			// Path found, reconstruct it
			const path = [current];
			while (
				cameFrom[current] !== undefined
			) {
				current = cameFrom[current];
				path.push(current);
			}
			return path.reverse();
		}

		openSet.delete(current!);

		for (const edge of nodes[current!]
			.edges) {
			const newGScore =
				gScore[current!] + edge.weight;
			if (
				newGScore <
				gScore[edge.targetIndex]
			) {
				cameFrom[edge.targetIndex] =
					current!;
				gScore[edge.targetIndex] =
					newGScore;
				fScore[edge.targetIndex] =
					gScore[edge.targetIndex] +
					heuristic(
						nodes[edge.targetIndex],
						nodes[goalIdx],
					);
				if (
					!openSet.has(edge.targetIndex)
				) {
					openSet.add(edge.targetIndex);
				}
			}
		}
	}

	return [];
}
