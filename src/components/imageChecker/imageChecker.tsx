"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardFooter, Input, Typography } from "@material-tailwind/react";
import UploadImage from "../imageUpload/imageUpload";
import Result from "../result/result";
import Image from "next/image";
import DriverInformation from "../driverInformation/driverInformation";
import Popup from "../popup/popup";

interface Label {
	Name: string;
	Confidence: number;
}

interface Step {
	label: string;
	title: string;
	description: string;
}

export function ImageChecker() {
	const router = useRouter();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState<string>("");
	const [labels, setLabels] = useState<Label[]>([]);
	const [showResult, setShowResult] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
	const [info, setInfo] = useState({ driverName: "", destination: "" });
	const [showPopup, setShowPopup] = useState(false);
	const [popupContent, setPopupContent] = useState({ heading: "", description: "" })


	// Define the steps array
	const steps: Step[] = [
		{
			label: "info",
			title: "Driver Information",
			description: "Enter name of driver and vehicle destination.",
		},
		{
			label: "shoes",
			title: "Driver Shoe Check",
			description: "Please upload an image of the driver's shoe",
		},
		{
			label: "numberPlate",
			title: "Truck Plate Check",
			description: "Please upload an image of the truck plate number",
		},
		{
			label: "mudguard",
			title: "Truck Mudguard Check",
			description: "Please upload an image of the truck mudguard",
		},
	];

	// Generate a preview URL when a file is selected
	useEffect(() => {
		if (selectedFile) {
			const url = URL.createObjectURL(selectedFile);
			setPreviewUrl(url);
			// Clean up the URL when the component unmounts or the file changes
			return () => URL.revokeObjectURL(url);
		}
	}, [selectedFile]);

	const handleUpload = async () => {
		if (!selectedFile) {
			setPopupContent({
				heading: "Information Missing",
				description: steps[currentStepIndex]?.description
			})
			setShowPopup(true)
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(selectedFile);
		reader.onloadend = async () => {
			const base64Image = reader.result as string;
			setUploadStatus("Uploading...");

			let uploadData;

			// Upload the image
			try {
				setLabels([]);

				const uploadResponse = await fetch('/api/uploadImageS3', {
					method: 'POST',

					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ image: base64Image }),
				});

				uploadData = await uploadResponse.json();
				console.log("Upload data is:", JSON.stringify(uploadData));
			}
			catch (error) {
				console.error("Error:", error);
				setUploadStatus("An error occurred during upload");
			}

			// uploadData = { imageUrl: "https://custom-labels-console-ap-south-1-c4254cce40.s3.amazonaws.com/user-uploads/1731328523045.jpg", objectKey: "user-uploads/1731328523045.jpg" }

			//detect labels
			if (uploadData.objectKey) {
				try {
					setUploadStatus("Image uploaded. Detecting labels...")
					setShowResult(false)

					const detectResponse = await fetch(`/api/${steps[currentStepIndex].label}`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ objectKey: uploadData.objectKey }),
					});

					const statusCode = detectResponse.status;
					const detectData = await detectResponse.json();
					console.log("detected data is ", detectResponse.status);


					if (statusCode === 503) {
						setUploadStatus(detectData.error);
						return;
					}

					if (detectResponse.status === 200 && detectData.labels.length > 0) {

						setLabels(detectData.labels || []);
						setShowResult(true)
						console.log("inside id ", detectData.labels);

						if (detectData.labels[0].Name == steps[currentStepIndex].label && detectData.labels[0].Confidence >= 60) {
							setUploadStatus("");
							setIsSuccess(true);
						}
						else {
							setUploadStatus("Image not clear. Try again.");
							setIsSuccess(false);
						}
					}
					else {
						setUploadStatus("Please try again.");
					}
				} catch (error) {
					console.error("Error:", error);
					setUploadStatus("An error occurred during label detection.");
				}
			} else {
				console.log("image not uploaded successfully");
			}
		};
	};

	const handleProceed = () => {
		setSelectedFile(null);
		setPreviewUrl(null);
		setLabels([]);
		setUploadStatus("");

		if (currentStepIndex === steps.length - 1) {
			setPopupContent({
				heading: "Finished",
				description: ""
			})
			setShowPopup(true)
			// router.push("/next-step");
		} else {
			setCurrentStepIndex(currentStepIndex + 1);
			setIsSuccess(false);
		}
	};

	return (
		<Card className="w-2/3 h-max flex justify-center items-center">
			<CardBody className="text-center flex flex-row gap-16">
				<div className="flex flex-col items-center gap-20">
					<Typography variant="h3" color="blue-gray" className="mb-2">
						{steps[currentStepIndex]?.title}({currentStepIndex + 1}/{steps.length})
					</Typography>
					<div>
						<Image src={"logoipsum.svg"} height={150} width={150} alt={"logo"} />
					</div>
					<Typography variant="h6" color="blue-gray" className="mb-2">
						{steps[currentStepIndex]?.description}
					</Typography>
				</div>
				<div className="min-h-96">
					{currentStepIndex === 0 ? (
						<DriverInformation info={info} setInfo={setInfo} setCurrentStepIndex={setCurrentStepIndex} />
					) : (
						<>
							<UploadImage
								selectedFile={selectedFile}
								setSelectedFile={setSelectedFile}
								previewUrl={previewUrl}
								uploadStatus={uploadStatus}
								isUploadDisabled={isSuccess}
							/>
							{showResult ? <Result success={isSuccess} labels={labels} /> : ""}
							{uploadStatus && (
								<p className={`text-sm mt-3 ${isSuccess ? "text-green-500" : "text-gray-600"}`}>
									{uploadStatus}
								</p>
							)}
							<CardFooter>
								<Button
									onClick={isSuccess ? handleProceed : handleUpload}
									disabled={uploadStatus === "Uploading..."}
								>
									{isSuccess ? "Proceed" : "Submit"}
								</Button>
							</CardFooter>
						</>
					)}
				</div>
				{showPopup && <Popup
					closePopup={() => setShowPopup(false)}
					popupContent={popupContent}
					size="xs"
				/>
				}
			</CardBody>
		</Card >
	)
}
