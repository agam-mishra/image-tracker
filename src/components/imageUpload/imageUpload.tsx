import { ChangeEvent } from 'react';
import { Card, Typography } from '@material-tailwind/react';

interface UploadImageProps {
	selectedFile: File | null;
	setSelectedFile: (file: File | null) => void;
	previewUrl: string | null;
	uploadStatus: string;
	isUploadDisabled: boolean; // New prop to disable buttons when conditions are met
}

export default function UploadImage({
	selectedFile,
	setSelectedFile,
	previewUrl,
	uploadStatus,
	isUploadDisabled,
}: UploadImageProps) {
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const file = event.target.files[0];
			setSelectedFile(file);
		}
	};

	const handlePhotoCapture = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const file = event.target.files[0];
			setSelectedFile(file);
		}
	};

	return (
		<Card className="flex flex-col items-center bg-gray-50 rounded-lg shadow-md w-full">
			<Typography variant="h5" className="text-center text-gray-700 py-3">
				Upload or Capture Photo
			</Typography>
			<div className="flex flex-row items-center p-3 space-x-8">
				<div className="flex flex-col items-center px-3 py-6 space-y-4">
					{/* Upload Photo Button */}
					<label
						htmlFor="upload-photo"
						className={`cursor-pointer ${isUploadDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
							} text-white py-2 px-4 rounded-lg shadow-md w-full text-center transition duration-200`}
					>
						{selectedFile ? "Change Photo" : "Upload Photo"}
						<input
							id="upload-photo"
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
							disabled={isUploadDisabled} // Disable upload input if isUploadDisabled is true
						/>
					</label>

					{/* Capture Photo Button */}
					<label
						htmlFor="capture-photo"
						className={`cursor-pointer ${isUploadDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
							} text-white py-2 px-4 rounded-lg shadow-md w-full text-center transition duration-200`}
					>
						{selectedFile ? "Retake Photo" : "Click Photo"}
						<input
							id="capture-photo"
							type="file"
							accept="image/*"
							capture="user"
							onChange={handlePhotoCapture}
							className="hidden"
							disabled={isUploadDisabled} // Disable capture input if isUploadDisabled is true
						/>
					</label>
				</div>

				{/* Display image preview if there's one */}
				<div>
					<div>
						{previewUrl ? (
							<div className="mt-4 w-full flex justify-center">
								<img
									src={previewUrl}
									alt="Selected preview"
									className="w-48 h-48 object-cover rounded-lg shadow-md"
								/>
							</div>
						) : (
							<div className="mt-4 grid h-48 w-48 place-items-center rounded-lg bg-gray-300">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="h-12 w-12 text-gray-500"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
									/>
								</svg>
							</div>
						)}
					</div>
				</div>
			</div>
		</Card>
	);
}
