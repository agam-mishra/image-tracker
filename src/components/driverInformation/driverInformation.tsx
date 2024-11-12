import { Input, Button, Typography, Card, CardBody, CardFooter } from "@material-tailwind/react";
import { useState } from "react";
import Popup from "../popup/popup";

interface DriverInformationProps {
	info: { driverName: string; destination: string };
	setInfo: (info: { driverName: string; destination: string }) => void;
	setCurrentStepIndex: (arg0: number) => void;
}

export default function DriverInformation({ info, setInfo, setCurrentStepIndex }: DriverInformationProps) {

	const [showPopup, setShowPopup] = useState(false);


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setInfo((prevInfo: { driverName: string; destination: string; }) => ({
			...prevInfo,
			[name]: value,
		} as { driverName: string; destination: string }));
	};


	const handleDriverInfoSubmit = () => {
		if (info.driverName && info.destination) {
			setCurrentStepIndex(1);
		} else {
			setShowPopup(true);
		}
	};

	return (
		<Card className="flex flex-col items-center bg-gray-50 rounded-lg shadow-md h-full gap-equal">
			<CardBody className="flex flex-col gap-5">
				<Typography variant="h4" color="blue-gray" className="mb-4 text-center">
					Enter Driver Information
				</Typography>
				<Input
					label="Driver Name"
					name="driverName"
					value={info.driverName}
					onChange={handleChange}
					className="mb-4" crossOrigin={undefined} />
				<Input
					label="Destination"
					name="destination"
					value={info.destination}
					onChange={handleChange}
					className="mb-4" crossOrigin={undefined}
				/>
			</CardBody>
			<CardFooter className="text-center">
				<Button onClick={handleDriverInfoSubmit} color="black">
					Submit
				</Button>
			</CardFooter>
			{showPopup && <Popup
				closePopup={() => setShowPopup(false)}
				popupContent={{ heading: "Information Missing", description: "Enter driver name and destination." }}
				size="xs"
			/>
			}
		</Card>
	);
}