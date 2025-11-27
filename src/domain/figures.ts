export interface FigureDefinition {
	id: string;
	name: string;
	type: "player" | "monster" | "summon";
	color: string; // Tailwind class for now
}

export const allFigures: FigureDefinition[] = [
	{ id: "brute", name: "Brute", type: "player", color: "bg-blue-500" },
	{ id: "scoundrel", name: "Scoundrel", type: "player", color: "bg-green-500" },
	{
		id: "spellweaver",
		name: "Spellweaver",
		type: "player",
		color: "bg-purple-500",
	},
	{ id: "tinkerer", name: "Tinkerer", type: "player", color: "bg-yellow-600" },
	{ id: "mindthief", name: "Mindthief", type: "player", color: "bg-blue-300" },
	{ id: "cragheart", name: "Cragheart", type: "player", color: "bg-green-700" },
	{ id: "guard", name: "Guard", type: "monster", color: "bg-red-500" },
	{ id: "archer", name: "Archer", type: "monster", color: "bg-yellow-500" },
	{ id: "skeleton", name: "Skeleton", type: "monster", color: "bg-gray-200" },
	{ id: "zombie", name: "Zombie", type: "monster", color: "bg-green-900" },
];
