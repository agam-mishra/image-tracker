import { RekognitionClient, DescribeProjectVersionsCommand } from "@aws-sdk/client-rekognition";

export async function checkProjectVersionStatus(client: RekognitionClient, projectVersionArn: string, versionName: string): Promise<boolean> {
	try {

		console.log("----projectVersionArn-----", projectVersionArn);

		// If either part is missing, throw an error to make troubleshooting easier
		if (!projectVersionArn || !versionName) {
			throw new Error("Invalid project version ARN format.");
		}


		const command = new DescribeProjectVersionsCommand({
			ProjectArn: projectVersionArn,
			//VersionNames: [versionName], // Extracted version name
		});

		const data = await client.send(command);
		const status = data.ProjectVersionDescriptions?.[0]?.Status;

		return status === "RUNNING";

	} catch (error) {
		console.error("Error checking project version status:", error);
		return false;
	}
}