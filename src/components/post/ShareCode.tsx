"use client";

import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";

// Define UI styles using provided CSS variables
const editorStyles = {
    container: {
        width: "100%",
        maxWidth: "672px",
        margin: "0 auto",
        padding: "16px",
        backgroundColor: "var(--hover)", // #f5f8fa (light) or #212429 (dark)
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: "1px solid var(--border-color)", // #e3e3e3 (light) or #323435 (dark)
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "16px",
    },
    flex1: {
        flex: 1,
    },
    editor: {
        fontFamily: '"Fira Code", "Fira Mono", monospace',
        fontSize: 14,
        backgroundColor: "var(--background-primary)", // #ffffff (light) or #101010 (dark)
        color: "var(--active-mode)", // #000000 (light) or #ffffff (dark)
        border: "2px solid var(--blue)", // #1E90FE
        borderRadius: "4px",
        padding: "10px",
        boxShadow: "inset 0 0 5px rgba(30, 144, 254, 0.3)",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
    },
    button: (isActive: boolean) => ({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "9999px",
        color: "#ffffff", // Explicitly set to white, overriding var(--active-mode)
        fontWeight: "600",
        backgroundColor: isActive ? "var(--blue)" : "var(--grey)", // #1E90FE or #f5f8fa (light) / #16181c (dark)
        cursor: isActive ? "pointer" : "not-allowed",
        transition: "background-color 0.2s, transform 0.1s",
        border: `1px solid ${isActive ? "var(--hover-blue)" : "var(--border-color)"}`, // #197CE3 or border color
        boxShadow: isActive ? "0 2px 8px rgba(30, 144, 254, 0.5)" : "none",
    }),
};

// VS Code Dark+ colors for code snippet highlighting
const prismStyles = `
    .token.comment { color: #6a9955; font-style: italic; } /* Green */
    .token.keyword { color: #569cd6; font-weight: bold; } /* Blue */
    .token.function { color: #dcdcaa; } /* Yellow */
    .token.string { color: #ce9178; } /* Peach */
    .token.number { color: #b5cea8; } /* Light green */
    .token.operator { color: #d4d4d4; } /* White */
    .token.punctuation { color: #d4d4d4; } /* White */
    .token.variable { color: #9cdcfe; } /* Light blue */
    .token.class-name { color: #4ec9b0; } /* Teal */
    .token.tag { color: #569cd6; } /* Blue (for <div>, <button>) */
    .token.attr-name { color: #9cdcfe; } /* Light blue (for style, onClick) */
    .token.attr-value { color: #ce9178; } /* Peach (for style values) */
    .token.property { color: #9cdcfe; } /* Light blue (for style properties) */
    .token.constant { color: #4fc1ff; } /* Bright blue */
    .token.boolean { color: #4fc1ff; } /* Bright blue */
    .token.parameter { color: #dcdcaa; } /* Yellow */
    .token.regex { color: #ce9178; } /* Peach */
    .token.important { color: #569cd6; font-weight: bold; } /* Blue */
    .token.namespace { color: #4ec9b0; } /* Teal */
`;

interface CodeShareProps {
    onCodeSubmit: (code: string) => void;
}

export default function CodeShare({ onCodeSubmit }: CodeShareProps) {
    const [code, setCode] = useState(`// Example JSX
<div style={{ color: "red" }}>
    <button onClick={() => alert("Hi")}>Click me</button>
</div>`);

    // Inject Prism styles on mount
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = prismStyles;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    const handleSubmit = () => {
        onCodeSubmit(code);
        alert("Code submitted: " + code);
    };
    

    return (
        <div style={editorStyles.container}>
            <div style={editorStyles.flexColumn}>
                <div style={editorStyles.flex1}>
                    <Editor
                        value={code}
                        onValueChange={(code) => setCode(code)}
                        highlight={(code) => highlight(code, languages.jsx, "jsx")}
                        padding={10}
                        style={editorStyles.editor}
                        textareaClassName="code-editor-textarea"
                    />
                </div>
                <div style={editorStyles.buttonContainer}>
                    <button
                        style={editorStyles.button(code.length > 0)}
                        disabled={code.length === 0}
                        onClick={handleSubmit}
                        onMouseOver={(e) => {
                            if (code.length > 0) {
                                e.currentTarget.style.backgroundColor = "var(--hover-blue)"; // #197CE3
                            }
                        }}
                        onMouseOut={(e) => {
                            if (code.length > 0) {
                                e.currentTarget.style.backgroundColor = "var(--blue)"; // #1E90FE
                                e.currentTarget.style.transform = "scale(1)";
                            }
                        }}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}