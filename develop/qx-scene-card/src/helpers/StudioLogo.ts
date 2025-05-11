const HideStudioLogo = (sceneCardNode: HTMLElement) => {
	if (!sceneCardNode) return;

	const logoNode = sceneCardNode.querySelector(".studio-overlay");
	logoNode?.classList.add("hide");
};

export default HideStudioLogo;
