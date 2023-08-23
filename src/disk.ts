export type Edge = {
    target: number;
    weight: number;
};

export function dijkstra(graph: Edge[][], start: number): number[] {
    const n = graph.length;
    const distances = new Array<number>(n).fill(Number.MAX_VALUE);
    distances[start] = 0;

    const queue: [number, number][] = [[0, start]];

    while (queue.length > 0) {
        const [dist, node] = queue.shift()!;

        if (dist > distances[node]) continue;

        for (const edge of graph[node]) {
            const newDist = dist + edge.weight;
            if (newDist < distances[edge.target]) {
                distances[edge.target] = newDist;
                queue.push([newDist, edge.target]);
            }
        }
    }

    return distances;
}
