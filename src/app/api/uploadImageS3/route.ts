import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request: Request) {
	try {
		const { image } = await request.json();

		// Assuming the image is base64 encoded
		const buffer = Buffer.from(image.split(',')[1], 'base64'); // Remove base64 prefix

		const s3Client = new S3Client({
			region: process.env.AWS_REGION,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
			},
		});

		// Define the object key (file path) in the S3 bucket
		const objectKey = `user-uploads/${Date.now()}.jpg`; // Dynamic filename with timestamp

		const uploadParams = {
			Bucket: process.env.AWS_S3_BUCKET_NAME as string, // Replace with your bucket name
			Key: objectKey,
			Body: buffer,
			ContentType: 'image/jpeg',
		};

		// Upload the image to S3
		const command = new PutObjectCommand(uploadParams);
		await s3Client.send(command);

		// Return the object key and image URL after upload
		const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
		return NextResponse.json({ imageUrl, objectKey });
	} catch (error) {
		console.error("Error uploading image to S3:", error);
		return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
	}
}
