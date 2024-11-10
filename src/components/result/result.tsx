interface Label {
	Name: string;
	Confidence: number;
}

interface ResultProps {
	labels: Label[];
}

export default function Result({ labels }: ResultProps) {
	return (
		<ul className="list-none list-inside text-gray-600 text-center mt-5 text-xl">
			{labels.map((label, index) => (
				<li key={index}>
					{label.Confidence > 90 ? (
						<span className="text-green-700 font-bold text-2xl">PASS</span>
					) : (
						<ul className="list-none text-center">
							<li className="text-red-500 font-bold text-2xl">FAIL</li>
							<li className="text-yellow-700">Try again</li>
						</ul>
					)}

					{/* {label.Name} - Confidence: {label.Confidence.toFixed(2)}% */}
				</li>
			))}
		</ul>
	);
}




