"use client";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import UploadImage from "../imageUpload/imageUpload";
import Result from "../result/result";
import Image from "next/image";

interface Label {
	Name: string;
	Confidence: number;
}

export function ImageChecker() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState<string>("");
	const [labels, setLabels] = useState<Label[]>([]);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

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

			let uploadData = {
				imageUrl: "",
				objectKey: "",
			};

			uploadData.objectKey = "user-uploads/1731159494389.jpg"; // Placeholder value for testing

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
		console.log("Proceeding to the next step...");
	};

	return (
		<Card className="w-2/3 h-max flex justify-center items-center">
			<div className="flex justify-center items-center">
				<CardBody className="text-center flex flex-row gap-16">
					<div className="flex flex-col items-center gap-20">
						<Typography variant="h3" color="blue-gray" className="mb-2">
							Driver Shoe Check (1/31)
						</Typography>
						<div>
							<Image src={"logoipsum.svg"} height={150} width={150} alt={"logo"} />
						</div>
						{/* Benefits :
						<ul>
							<li>good for everyone</li>
							<li>keeps you safe</li>
						</ul> */}
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
						{/* Display upload status if available */}
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
