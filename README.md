# Driver Shoes & Vehicle Number Plate Detection Using AWS Rekognition

This project leverages AWS Rekognition's custom labels to identify and verify critical visual elements, specifically targeting driver shoes and vehicle number plates. Utilizing artificial intelligence and AWS Rekognition, the system accurately detects and confirms the presence of these items in uploaded images, enabling automated checks in scenarios such as transportation, logistics, and fleet management.

## Features
- **Driver Shoes Detection**: Ensures the driver's shoes are present and meet the required standards.
- **Vehicle Number Plate Detection**: Verifies the presence of the vehicle's license plate to improve security and identification processes.
- **Step-by-Step Checks**: Guides the user through a sequence of checks, including shoe and plate verification.
- **Upload and Detect Flow**: Users can upload images, and the system processes these images using AWS Rekognition to detect and validate the labels.

## Technologies Used
- **AWS Rekognition**: Custom label models for image recognition.
- **Next.js**: Front-end framework for UI components and interactions.
- **Material Tailwind**: For UI styling and responsive design.
- **AWS S3**: Image storage for files uploaded by the user.

## Installation & Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**: Configure your AWS credentials and necessary environment variables in `.env`.
3. **Run the project**:
   ```bash
   npm run dev
   ```

## Usage
1. **Driver Information Input**: User enters driver details and destination.
2. **Image Upload**: The system prompts for image uploads for shoes and vehicle number plates.
3. **Detection**: After each image is uploaded, AWS Rekognition analyzes it, providing real-time feedback on whether the required labels are detected.

## Contributing
Feel free to open a pull request or issue for any improvements, feature requests, or bug fixes.
