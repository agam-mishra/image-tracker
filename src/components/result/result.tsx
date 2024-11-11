interface Label {
	Name: string;
	Confidence: number;
}

interface ResultProps {
	success: boolean;
	labels: Label[];
}

export default function Result({ success, labels }: ResultProps) {
	return (
		<ul className="list-none list-inside text-gray-600 text-center mt-5 text-xl">
			{labels.map((label, index) => (
				<li key={index} >
					{success ? (
						<>
							<span className="text-green-700 font-bold text-2xl">PASS</span>
							<div>{label.Name} - Confidence: {label.Confidence.toFixed(2)}%</div>
						</>
					) : (
						<>
							<li className="text-red-500 font-bold text-2xl">FAIL</li>
							<div className="text-base">{label.Name} - Confidence: {label.Confidence.toFixed(2)}%</div>
							<li className="text-yellow-700 text-base">Try again</li>
						</>
					)
					}
				</li>
			))}
		</ul >
	);
}