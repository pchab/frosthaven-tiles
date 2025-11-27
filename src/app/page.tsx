import Heading from "@/app/_components/layout/Heading";
import Image from "next/image";
import TileComponent from "./_components/tiles/Tile";
import allTiles from "@/domain/tiles";

export default function MainPage() {
	return (
		<div className="flex flex-col gap-16 p-16 place-items-center">
			<Image
				role="banner"
				priority
				loading="eager"
				src="/fh-frosthaven-logo.webp"
				alt="Frosthaven logo"
				width={600}
				height={87}
			/>
			<Heading title="Select a scenario" />

			<TileComponent tile={allTiles[0]} />
		</div>
	);
}
