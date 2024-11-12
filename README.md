# Image Checker

This project is a Next.js application designed to handle a multi-step image-checking process, allowing users to upload images for specific checks and receive validation responses. A popup modal provides feedback when required fields are missing or when certain conditions are met.

## Features

- **Multi-Step Image Upload**: Users can upload images based on a set of steps and receive validation responses.
- **Label Detection**: Utilizes AWS Rekognition to validate images and ensure they meet specified criteria.
- **Popup Modal**: A reusable modal component is used to display feedback, such as missing information or step completion notifications.

## Project Structure

- `ImageChecker`: Main component that manages the step-by-step image checking process.
- `Popup`: Modal component used to display alerts or feedback to the user.
- `DriverInformation`: Component for entering driver details, such as name and destination.
- `Result`: Component to display label detection results.

## Getting Started

### Prerequisites

- Node.js and npm
- AWS account for using AWS Rekognition
- Necessary AWS credentials and permissions to upload images to S3 and detect labels

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/agam-mishra/image-tracker.git
    ```

2. Navigate to the project directory:

    ```bash
    cd image-tracker
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables for AWS SDK and Rekognition configuration.

### Usage

1. **Start the Development Server**:

    ```bash
    npm run dev
    ```

2. **Open the App**:

    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

3. **Image Upload Process**:

    - The app will prompt for driver details, including name and destination.
    - After providing the required information, users can proceed with the multi-step image upload.
    - Each step requires a specific image for validation. If validation fails, users are prompted to retry.
    - After completing all steps, the process finishes, and a completion popup appears.

### Components

#### ImageChecker

The main component that handles the step-by-step image upload and validation process. It includes the following:

- **State Management**:
  - `currentStepIndex`: Tracks the current step in the process.
  - `info`: Stores driver information (name and destination).
  - `popupContent`: Stores content for the popup modal, with `heading` and `description` as optional fields.

- **Popup Handling**:
  - `setPopupContent`: Updates the popup's heading or description, setting defaults when only one is provided.

- **Methods**:
  - `handleDriverInfoSubmit`: Checks if all driver details are provided. If not, the popup modal prompts the user.

#### Popup

A reusable modal component that displays feedback or alerts. It takes in `closePopup` to handle the close action and `popupContent` for the content to be displayed.

- **Props**:
  - `closePopup`: Function to close the popup.
  - `popupContent`: Object containing `heading` (optional) and `description` (optional) to customize the modal message.

#### DriverInformation

A form component for capturing driver details, including name and destination. It updates the `info` state in `ImageChecker`.

#### Result

Displays the outcome of the label detection process, such as "PASS" or "FAIL" based on the image validation.

## Code Snippets

### Set Popup Content with Optional Fields

To update only the heading in the `popupContent` state while keeping the `description` empty:

```typescript
setPopupContent((prevContent) => ({
  ...prevContent,
  heading: "Finished",
  description: "" // Sets the description to an empty string if not provided
}));
