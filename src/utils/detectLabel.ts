async function uploadImage(file: Blob) {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onloadend = async () => {
		const base64Image = reader.result;

		// Upload the image to S3
		const uploadResponse = await fetch('/api/uploadImage', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ image: base64Image }),
		});

		const uploadData = await uploadResponse.json();
		if (uploadData.imagePath) {
			// Now detect labels using the uploaded image path
			const detectResponse = await fetch('/api/detectLabels', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ imagePath: uploadData.imagePath }),
			});

			const detectData = await detectResponse.json();
			console.log("Detected labels:", detectData.labels);
		} else {
			console.error("Error uploading image:", uploadData.error);
		}
	};
}
