export interface FigureDefinition {
	id: string;
	name: string;
	type: "player" | "monster" | "summon";
	color: string; // Tailwind class for now
	imagePath?: string;
}

export const allFigures: FigureDefinition[] = [
	{
		id: "banner-spear",
		name: "Banner Spear",
		type: "player",
		color: "bg-blue-500",
		imagePath: "/standees/fh-banner-spear-standee-front.png",
	},
	{
		id: "blinkblade",
		name: "Blinkblade",
		type: "player",
		color: "bg-yellow-500",
		imagePath: "/standees/fh-blinkblade-standee-front.png",
	},
	{
		id: "boneshaper",
		name: "Boneshaper",
		type: "player",
		color: "bg-green-500",
		imagePath: "/standees/fh-boneshaper-standee-front.png",
	},
	{
		id: "deathwalker",
		name: "Deathwalker",
		type: "player",
		color: "bg-purple-500",
		imagePath: "/standees/fh-deathwalker-standee-front.png",
	},
	{
		id: "drifter",
		name: "Drifter",
		type: "player",
		color: "bg-orange-500",
		imagePath: "/standees/fh-drifter-standee-front.png",
	},
	{
		id: "geminate-melee",
		name: "Geminate (Melee)",
		type: "player",
		color: "bg-red-500",
		imagePath: "/standees/fh-geminate-melee-standee-front.png",
	},
	{
		id: "geminate-ranged",
		name: "Geminate (Ranged)",
		type: "player",
		color: "bg-red-400",
		imagePath: "/standees/fh-geminate-ranged-standee-front.png",
	},
	// Monsters (using placeholders for now as we don't have generic monster images yet, or we could map some)
	{ id: "guard", name: "Guard", type: "monster", color: "bg-red-500" },
	{ id: "archer", name: "Archer", type: "monster", color: "bg-yellow-500" },
	{ id: "skeleton", name: "Skeleton", type: "monster", color: "bg-gray-200" },
	{ id: "zombie", name: "Zombie", type: "monster", color: "bg-green-900" },
];
