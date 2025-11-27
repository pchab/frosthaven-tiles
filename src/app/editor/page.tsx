"use client";

import React, { useState } from "react";
import allTiles from "../../domain/tiles";
import { TileEditor } from "./_components/TileEditor";
import type { Tile } from "../../domain/tiles.model";

export default function EditorPage() {
	const [selectedTileId, setSelectedTileId] = useState<string>(allTiles[0].id);

	const selectedTile = allTiles.find((t) => t.id === selectedTileId);

	return (
		<div className="flex h-screen w-screen bg-slate-900 text-white">
			<div className="w-64 border-r border-slate-700 p-4 overflow-y-auto">
				<h1 className="text-xl font-bold mb-4">Tile Editor</h1>
				<div className="space-y-2">
					{allTiles.map((tile) => (
						<button
							key={tile.id}
							onClick={() => setSelectedTileId(tile.id)}
							className={`w-full text-left p-2 rounded ${
								selectedTileId === tile.id
									? "bg-blue-600"
									: "hover:bg-slate-800"
							}`}
						>
							{tile.id}
						</button>
					))}
				</div>
			</div>
			<div className="flex-1 p-4 overflow-hidden">
				{selectedTile ? (
					<TileEditor tile={selectedTile} />
				) : (
					<div className="flex items-center justify-center h-full text-slate-500">
						Select a tile to edit
					</div>
				)}
			</div>
		</div>
	);
}
