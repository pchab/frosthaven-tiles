"use client";

import React from "react";
import allTiles from "../../domain/tiles";

export function TilePalette() {
	const handleDragStart = (e: React.DragEvent, tileId: string) => {
		e.dataTransfer.setData("tileId", tileId);
	};

	return (
		<div className="w-64 bg-slate-900 text-white p-4 h-full overflow-y-auto border-r border-slate-700">
			<h2 className="text-xl font-bold mb-4">Tiles</h2>
			<div className="grid grid-cols-2 gap-4">
				{allTiles.map((tile) => (
					<div
						key={tile.id}
						draggable
						onDragStart={(e) => handleDragStart(e, tile.id)}
						className="cursor-grab hover:bg-slate-800 p-2 rounded border border-transparent hover:border-slate-600 transition-colors"
					>
						<div className="aspect-square relative mb-2">
							<img
								src={tile.path}
								alt={tile.id}
								className="object-contain w-full h-full"
							/>
						</div>
						<div className="text-center text-sm font-mono">{tile.id}</div>
					</div>
				))}
			</div>
		</div>
	);
}
