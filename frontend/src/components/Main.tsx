import React, { useState } from "react";

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { RowFlex } from "./shared";
import Editor from "./Editor";
import Preview from "./Preview";

interface Props {
    theme: string;
}

const Main: React.FC<Props> = ({ theme }) => {
    const [markdownContent, setMarkdownContent] = useState<string>();
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
