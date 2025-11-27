"use client";

import React from "react";
import { allFigures } from "../../domain/figures";

export function FigurePalette() {
	const handleDragStart = (e: React.DragEvent, figureId: string) => {
		e.dataTransfer.setData("figureId", figureId);
	};

	return (
		<div className="w-64 bg-slate-900 text-white p-4 h-full overflow-y-auto border-l border-slate-700">
			<h2 className="text-xl font-bold mb-4">Figures</h2>
			<div className="space-y-4">
				{allFigures.map((fig) => (
					<div
						key={fig.id}
						draggable
						onDragStart={(e) => handleDragStart(e, fig.id)}
						className="cursor-grab hover:bg-slate-800 p-2 rounded border border-transparent hover:border-slate-600 transition-colors flex items-center gap-3"
					>
						<div
							className={`w-8 h-8 rounded-full ${fig.color} flex items-center justify-center text-xs font-bold text-black`}
						>
							{fig.name[0]}
						</div>
						<div className="text-sm font-mono">{fig.name}</div>
					</div>
				))}
			</div>
		</div>
	);
}
