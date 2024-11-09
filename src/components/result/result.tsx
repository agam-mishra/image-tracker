interface Label {
	Name: string;
	Confidence: number;
}

interface ResultProps {
	labels: Label[];
}

export default function Result({ labels }: ResultProps) {
	return (
		<ul className="list-none list-inside text-gray-600">
			{labels.map((label, index) => (
				<li key={index}>
					{label.Confidence > 90 ? (
						<span className="text-green-500">PASS</span>
					) : (
						<ul className="list-none">
							<li className="text-red-500">FAIL</li>
							<li className="text-yellow-500">Please try again</li>
						</ul>
					)}

					{/* {label.Name} - Confidence: {label.Confidence.toFixed(2)}% */}
				</li>
			))}
		</ul>
	);
}




