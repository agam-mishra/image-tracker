import { useState } from "react";
import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
} from "@material-tailwind/react";

interface PopupProps {
	closePopup: () => void;
	popupContent: {
		heading?: string,
		description?: string
	};
	size: "xs" | "sm" | "md";
}

export default function Popup({ closePopup, popupContent, size }: PopupProps) {

	return (
		<Dialog handler={closePopup} size={size} open={true}>
			<DialogHeader>{popupContent?.heading}</DialogHeader>
			<DialogBody>
				{popupContent?.description}
			</DialogBody>
			<DialogFooter>
				<Button
					variant="text"
					color="red"
					onClick={() => {
						closePopup();
					}}
					className="mr-1"
				>
					<span>Close</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
}
