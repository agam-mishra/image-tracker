import { NextResponse } from 'next/server';
import { RekognitionClient, DetectCustomLabelsCommand } from "@aws-sdk/client-rekognition";
import { checkProjectVersionStatus, extractProjectArn } from '@/utils/checkModelAvailability';

interface DetectLabelsResponse {
	labels?: object[];
	error?: string;
	message?: string;
}


export async function POST(request: Request) {
	let isReady;

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

		const projectVersionArn = process.env.NUMBERPLATE_PROJECT_VERSION_ARN as string;
		const projectDetails = await extractProjectArn(projectVersionArn)
		if (projectDetails) {
			isReady = await checkProjectVersionStatus(client, projectDetails.projectArn, projectDetails.versionName);
		} else {
			console.error('Project Version ARN is not valid.');
		}

		//check model availability
		if (!isReady) {
			console.log("Number plate version is not ready. Please try again later.");
			return NextResponse.json(
				{ error: "Number plate version is not ready. Please try again later." },
				{ status: 503 }
			);
		}

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
		console.error("Error detecting number plate custom labels:", error);
		return NextResponse.json({ error: "Error number plate detecting custom labels" }, { status: 500 });
	}
}

export async function OPTIONS() {
	return NextResponse.json({ message: "Only POST method is allowed" }, { status: 405 });
}
