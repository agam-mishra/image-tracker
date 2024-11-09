"use client"
import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, Typography } from '@material-tailwind/react';
import UploadImage from '../imageUpload/imageUpload';
import Result from '../result/result';

interface Label {
	Name: string;
	Confidence: number;
}

export function ImageChecker() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState<string>('');
	const [labels, setLabels] = useState<Label[]>([]);

	// Generate a preview URL when a file is selected
	if (selectedFile && !previewUrl) {
		const previewUrl = URL.createObjectURL(selectedFile);
		setPreviewUrl(previewUrl);
	}

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
				objectKey: ""
			};

			// Upload the image
			// try {
			// 	const uploadResponse = await fetch('/api/uploadImageS3', {
			// 		method: 'POST',

			// 		headers: { 'Content-Type': 'application/json' },
			// 		body: JSON.stringify({ image: base64Image }),
			// 	});

			// 	uploadData = await uploadResponse.json();
			// 	console.log("Upload data is:", JSON.stringify(uploadData));
			// }
			// catch (error) {
			// 	console.error("Error:", error);
			// 	setUploadStatus("An error occurred during upload");
			// }
			uploadData.objectKey = "user-uploads/1731159494389.jpg"


			// Detect labels on the uploaded image
			if (uploadData?.objectKey) {
				try {
					setUploadStatus("Image uploaded. Detecting labels...");

					const detectResponse = await fetch('/api/detectLabels', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ objectKey: uploadData.objectKey }),
					});

					const statusCode = detectResponse.status;
					console.log("Status Code:", statusCode);

					if (statusCode === 503) {
						setUploadStatus(JSON.stringify(detectResponse));
						return;
					}


					const detectData = await detectResponse.json();
					console.log("label is:", JSON.stringify(detectData));

					detectData.labels = [{
						"Confidence": 80
					}]

					setLabels(detectData.labels || []);
					
					/**
					 * Not required for user to see labels info
					 */
					
					// if (detectData.labels) {
					// 	setUploadStatus("Labels detected successfully!");
					// }
				} catch (error) {
					console.error("Error:", error);
					setUploadStatus("An error occurred during label detection.");
				}
			}
			else {
				console.log("image not uploaded successfully");
			}
		}
	};

	return (
		<Card className="w-2/3 h-2/3 flex justify-center items-center">
			<div className="flex justify-center items-center">
				<CardBody>
					<Typography variant="h5" color="blue-gray" className="mb-2">
						Driver Shoe Check (1/31)
					</Typography>
					<UploadImage
						selectedFile={selectedFile}
						setSelectedFile={setSelectedFile}
						previewUrl={previewUrl}
						uploadStatus={uploadStatus}
					/>
					{labels.length > 0 && (
						<Result labels={labels}></Result>
					)}
				</CardBody>
			</div>
			<CardFooter className="pt-0">
				<Button onClick={handleUpload}>Submit</Button>
			</CardFooter>
		</Card>
	);
}
