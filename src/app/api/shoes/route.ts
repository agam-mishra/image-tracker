import { NextResponse } from 'next/server';
import { RekognitionClient, DetectCustomLabelsCommand } from "@aws-sdk/client-rekognition";
import { checkProjectVersionStatus } from '@/utils/checkModelAvailability';

interface DetectLabelsResponse {
	labels?: object[];
	error?: string;
	message?: string;
}


export async function POST(request: Request) {
	try {
		const { objectKey } = await request.json();

		if (!objectKey) {
			return NextResponse.json(
				{ error: "Image objectKey is required" },
				{ status: 400 }
			);
		}

		const client = new RekognitionClient({
			region: process.env.AWS_REGION,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
			},
		});

		const projectVersionArn = process.env.SHOES_PROJECT_VERSION_ARN as string;
		const versionName = process.env.SHOES_PROJECT_VERSION as string;

		// Check if the project version is ready
		const isReady = await checkProjectVersionStatus(client, projectVersionArn, versionName);

		//check model availability
		// if (!isReady) {
		// 	console.log("Shoes project is not ready. Please try again later.");
		// 	return NextResponse.json(
		// 		{ error: "Shoes project is not ready. Please try again later." },
		// 		{ status: 503 }
		// 	);
		// }

		const command = new DetectCustomLabelsCommand({
			ProjectVersionArn: projectVersionArn,
			Image: {
				S3Object: {
					Bucket: process.env.AWS_S3_BUCKET_NAME as string,
					Name: objectKey,
				},
			},
		});

		const data = await client.send(command);
		return NextResponse.json({ labels: data.CustomLabels } as DetectLabelsResponse);
	} catch (error) {
		console.error("Error detecting shoes custom labels:", error);
		return NextResponse.json({ error: "Error detecting shoes custom labels" }, { status: 500 });
	}
}

export async function OPTIONS() {
	return NextResponse.json({ message: "Only POST method is allowed" }, { status: 405 });
}
