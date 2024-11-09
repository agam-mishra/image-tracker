import { ImageChecker } from "@/components/imageChecker/imageChecker";

export default function Home() {
	return (
		<div className="main-container">
			<div className="step-container flex items-center justify-center h-screen">
				<ImageChecker />
			</div>
		</div>
	)
}
