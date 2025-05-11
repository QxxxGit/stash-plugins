const SetWatchedProperty = (sceneCardNode: HTMLElement, views: number) => {
	if (!sceneCardNode || views === 0) return;

	sceneCardNode.classList.add("watched");
};

export default SetWatchedProperty;
