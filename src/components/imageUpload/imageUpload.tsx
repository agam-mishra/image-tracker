import { ChangeEvent } from 'react';

interface Label {
	Name: string;
	Confidence: number;
}

interface UploadImageProps {
	selectedFile: File | null;
	setSelectedFile: (file: File | null) => void;
	previewUrl: string | null;
	uploadStatus: string;
}

export default function UploadImage({
	selectedFile,
	setSelectedFile,
	previewUrl,
	uploadStatus,
}: UploadImageProps) {
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const file = event.target.files[0];
			setSelectedFile(file);
		}
	};

	return (
		<div className="flex flex-col items-center space-y-4">
			<label htmlFor="upload-photo" className="cursor-pointer bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 transition duration-200">
				Upload Photo
				<input
					id="upload-photo"
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="hidden"
				/>
			</label>

			{previewUrl && (
				<div className="mt-4">
					<h4 className="font-bold text-gray-700">Image Preview:</h4>
					<img src={previewUrl} alt="Selected preview" className="mt-2 w-40 h-40 object-cover rounded-lg shadow-md" />
				</div>
			)}

			{uploadStatus && <p className="text-sm text-gray-600">{uploadStatus}</p>}
		</div>
	);
}
