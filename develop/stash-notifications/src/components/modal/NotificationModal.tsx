import { libraries, React } from "../../globals";

const NotificationModal: React.FC<{
	display: boolean;
	onClose: () => void;
	content: React.ReactNode;
}> = ({ display, onClose, content }) => {
	const { Button, Modal } = libraries.Bootstrap;

	if (!display) return null;

	return (
		<Modal
			className="stash-notification-modal"
			show={display}
			onHide={onClose}
			centered
		>
			{typeof content === "string" ? (
				<>
					<Modal.Header closeButton>
						<Modal.Title>Notification</Modal.Title>
					</Modal.Header>
					<Modal.Body>{content}</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={onClose}>
							Cancel
						</Button>
					</Modal.Footer>
				</>
			) : (
				content
			)}
		</Modal>
	);
};

export default NotificationModal;
