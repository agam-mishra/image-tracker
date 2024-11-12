import { RekognitionClient, DescribeProjectVersionsCommand } from "@aws-sdk/client-rekognition";

export async function checkProjectVersionStatus(client: RekognitionClient, projectArn: string, versionName: string): Promise<boolean> {
	try {

		if (!projectArn || !versionName) {
			throw new Error("Invalid project version ARN format.");
		}

		const command = new DescribeProjectVersionsCommand({
			ProjectArn: projectArn,
			VersionNames: [versionName], // Extracted version name
		});

		const data = await client.send(command);
		const status = data.ProjectVersionDescriptions?.[0]?.Status;

		return status === "RUNNING";

	} catch (error) {
		console.error("Error checking project version status:", error);
		return false;
	}
}

/**
 * Method to extract projectArn and versionNames of model.
 */
export async function extractProjectArn(projectVersionArn: string) {
	const regex = /^arn:aws:rekognition:[a-z\d-]+:[\d]+:project\/([a-zA-Z0-9_.\-]+)\/version\/([a-zA-Z0-9_.\-]+)\/(\d+)$/;

	// Match the version ARN with the regex
	const match = projectVersionArn.match(regex);

	if (match) {
		const name = `arn:aws:rekognition:${projectVersionArn.split(':')[3]}:${projectVersionArn.split(':')[4]}:project/${match[1]}`;
		const versionName = match[2];
		const versionId = match[3];
		const projectArn = name + "/" + versionId;

		return {
			projectArn, versionName
		}
	} else {
		return null
	}
}