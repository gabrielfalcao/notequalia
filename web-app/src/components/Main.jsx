import React, { useState } from "react";
import Editor from "./Editor";
import Preview from "./Preview";
const Main = ({ theme }) => {
	const [markdownContent, setMarkdownContent] = useState();
	return (
		<React.Fragment>
			<Editor
				theme={theme}
				markdownContent={markdownContent}
				setMarkdownContent={setMarkdownContent}
			/>
			<Preview theme={theme} markdownContent={markdownContent} />
		</React.Fragment>
	);
};
export default Main;
