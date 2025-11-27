"use client";

import React, { useState } from "react";
import { Board } from "./_components/Board";
import { TilePalette } from "./_components/TilePalette";
import { FigurePalette } from "./_components/FigurePalette";
import type { BoardState } from "../domain/board.model";

export default function Home() {
	const [boardState, setBoardState] = useState<BoardState>({
		tiles: [],
		figures: [],
	});

	// Load from LocalStorage on mount
	React.useEffect(() => {
		const saved = localStorage.getItem("frosthaven-board-state");
		if (saved) {
			try {
				setBoardState(JSON.parse(saved));
			} catch (e) {
				console.error("Failed to parse board state", e);
			}
		}
	}, []);

	// Save to LocalStorage on change
	React.useEffect(() => {
		localStorage.setItem("frosthaven-board-state", JSON.stringify(boardState));
	}, [boardState]);

	return (
		<main className="flex h-screen w-screen overflow-hidden bg-black relative">
			<a
				href="/editor"
				className="absolute top-2 right-2 z-50 text-white bg-slate-800 px-2 py-1 rounded text-xs hover:bg-slate-700"
			>
				Tile Editor
			</a>
			<TilePalette />
			<div className="flex-1 relative">
				<Board boardState={boardState} onUpdateBoard={setBoardState} />
			</div>
			<FigurePalette />
		</main>
	);
}
