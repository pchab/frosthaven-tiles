"use server";

import fs from "fs/promises";
import path from "path";
import type { Tile } from "../domain/tiles.model";

export async function saveTile(updatedTile: Tile) {
	const filePath = path.join(process.cwd(), "src/domain/tiles.json");

	try {
		const fileContent = await fs.readFile(filePath, "utf-8");
		const tiles: Tile[] = JSON.parse(fileContent);

		const index = tiles.findIndex((t) => t.id === updatedTile.id);
		if (index !== -1) {
			tiles[index] = updatedTile;
		} else {
			tiles.push(updatedTile);
		}

		await fs.writeFile(filePath, JSON.stringify(tiles, null, 2));
		return { success: true };
	} catch (error) {
		console.error("Failed to save tile:", error);
		return { success: false, error };
	}
}
