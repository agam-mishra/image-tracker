"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import UploadImage from "../imageUpload/imageUpload";
import Result from "../result/result";
import Image from "next/image";

interface Label {
	Name: string;
	Confidence: number;
}

interface Step {
	id: string;
	title: string;
	description: string;
}

export function ImageChecker() {
	const router = useRouter();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState<string>("");
	const [labels, setLabels] = useState<Label[]>([]);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [currentStepIndex, setCurrentStepIndex] = useState<number>(0); // Index of the current step

	// Define the steps array
	const steps: Step[] = [
		{
			id: "shoe",
			title: "Driver Shoe Check (1/31)",
			description: "Please upload an image of the driver's shoe",
		},
		{
			id: "plate",
			title: "Truck Plate Check (2/31)",
			description: "Please upload an image of the truck plate number",
		},
		{
			id: "mudguard",
			title: "Truck Mudguard Check (3/31)",
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
			alert("Please select an image first!");
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(selectedFile);
		reader.onloadend = async () => {
			const base64Image = reader.result as string;
			setUploadStatus("Uploading...");

			let uploadData = { imageUrl: "", objectKey: "user-uploads/1731159494389.jpg" };

			if (uploadData.objectKey) {
				try {
					setUploadStatus("Image uploaded. Detecting labels...");

					const detectResponse = await fetch("/api/detectLabels", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ objectKey: uploadData.objectKey }),
					});

					const statusCode = detectResponse.status;
					const detectData = await detectResponse.json();

					if (statusCode === 503) {
						setUploadStatus(detectData.error);
						return;
					}

					if (detectResponse.status === 200) {
						// Mocked label data
						detectData.labels = [{ Confidence: 91 }];
						setLabels(detectData.labels || []);
						setUploadStatus("");
						setIsSuccess(true);
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

		// If on the last step, navigate to the next page
		if (currentStepIndex === steps.length - 1) {
			alert("Finished")
			// router.push("/next-step");
		} else {
			// Otherwise, move to the next step
			setCurrentStepIndex(currentStepIndex + 1);
			setIsSuccess(false); // Reset success status when moving to the next step
		}
	};

	return (
		<Card className="w-2/3 h-max flex justify-center items-center">
			<div className="flex justify-center items-center">
				<CardBody className="text-center flex flex-row gap-16">
					<div className="flex flex-col items-center gap-20">
						<Typography variant="h3" color="blue-gray" className="mb-2">
							{steps[currentStepIndex].title}
						</Typography>
						<div>
							<Image src={"logoipsum.svg"} height={150} width={150} alt={"logo"} />
						</div>
						<Typography variant="h6" color="blue-gray" className="mb-2">
							{steps[currentStepIndex].description}
						</Typography>
					</div>
					<div className="">
						<UploadImage
							selectedFile={selectedFile}
							setSelectedFile={setSelectedFile}
							previewUrl={previewUrl}
							uploadStatus={uploadStatus}
							isUploadDisabled={isSuccess}
						/>
						{labels.length > 0 && <Result labels={labels} />}
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
					</div>
				</CardBody>
			</div>
		</Card>
	);
}
