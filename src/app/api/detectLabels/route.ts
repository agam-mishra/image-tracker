import { NextResponse } from 'next/server';
import { RekognitionClient, DetectCustomLabelsCommand, DescribeProjectVersionsCommand } from "@aws-sdk/client-rekognition";

interface DetectLabelsResponse {
	labels?: object[];
	error?: string;
	message?: string;
}

async function checkProjectVersionStatus(client: RekognitionClient, projectVersionArn: string): Promise<boolean> {
	try {
		const command = new DescribeProjectVersionsCommand({
			ProjectArn: projectVersionArn.split('/version/')[0], // Extract the ProjectArn
		});
		const data = await client.send(command);
		const status = data.ProjectVersionDescriptions?.[0].Status;

		return status === "RUNNING";
	} catch (error) {
		console.error("Error checking project version status:", error);
		return false;
	}
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

		// Check if the project version is ready
		const projectVersionArn = process.env.PROJECT_VERSION_ARN as string;
		const isReady = await checkProjectVersionStatus(client, projectVersionArn);

		if (!isReady) {
			console.log("Project version is not ready. Please try again later.");
			return NextResponse.json(
				{ error: "Project version is not ready. Please try again later." },
				{ status: 500 }
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
		console.error("Error detecting custom labels:", error);
		return NextResponse.json({ error: "Error detecting custom labels" }, { status: 500 });
	}
}

export async function OPTIONS() {
	return NextResponse.json({ message: "Only POST method is allowed" }, { status: 405 });
}
