"use client";

import * as React from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Settings, Download, Maximize2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";

const LANGUAGES = [
    { name: "python", version: "3.10.0", label: "Python 3", defaultCode: "# Cook your dish here\nprint('Hello, World!')" },
    { name: "javascript", version: "18.15.0", label: "JavaScript", defaultCode: "// Cook your dish here\nconsole.log('Hello, World!');" },
    { name: "typescript", version: "5.0.3", label: "TypeScript", defaultCode: "// Cook your dish here\nconsole.log('Hello, World!');" },
    { name: "cpp", version: "10.2.0", label: "C++", defaultCode: "// Cook your dish here\n#include <iostream>\n\nint main() {\n    std::cout << \"Hello, World!\" << std::endl;\n    return 0;\n}" },
    { name: "java", version: "15.0.2", label: "Java", defaultCode: "// Cook your dish here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}" },
    { name: "c", version: "10.2.0", label: "C", defaultCode: "// Cook your dish here\n#include <stdio.h>\n\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}" },
];

export default function CompilerPage() {
    const { theme } = useTheme();
    const [language, setLanguage] = React.useState(LANGUAGES[0]);
    const [code, setCode] = React.useState(LANGUAGES[0].defaultCode);
    const [input, setInput] = React.useState("");
    const [output, setOutput] = React.useState("");
    const [isRunning, setIsRunning] = React.useState(false);

    const handleLanguageChange = (value: string) => {
        const selected = LANGUAGES.find((l) => l.name === value);
        if (selected) {
            setLanguage(selected);
            setCode(selected.defaultCode);
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput("");
        try {
            const response = await fetch("/api/compile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language: language.name,
                    version: language.version,
                    files: [
                        {
                            content: code,
                        },
                    ],
                    stdin: input,
                }),
            });

            const data = await response.json();

            if (data.run) {
                setOutput(data.run.output);
            } else if (data.message) {
                setOutput(data.message);
            } else {
                setOutput("An error occurred during execution.");
            }
        } catch (error) {
            setOutput("Failed to connect to the server.");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="border-b px-6 py-3 flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold">Online Compiler</h1>
                    <Select value={language.name} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGES.map((lang) => (
                                <SelectItem key={lang.name} value={lang.name}>
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" className="gap-2" disabled>
                        <Eye className="h-4 w-4" />
                        Visualize Code
                    </Button>
                    <Button onClick={runCode} disabled={isRunning} className="gap-2">
                        {isRunning ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                        Run
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Editor Section */}
                <div className="flex-1 border-r flex flex-col min-h-[500px]">
                    <Editor
                        height="100%"
                        language={language.name === "cpp" || language.name === "c" ? "cpp" : language.name}
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        theme={theme === "dark" ? "vs-dark" : "light"}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            padding: { top: 16 },
                            scrollBeyondLastLine: false,
                        }}
                    />
                </div>

                {/* Input/Output Section */}
                <div className="w-full md:w-[40%] flex flex-col bg-muted/30">
                    {/* Input */}
                    <div className="flex-1 p-4 flex flex-col gap-2 border-b">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Input</span>
                        </div>
                        <Textarea
                            placeholder="Enter input here..."
                            className="flex-1 font-mono resize-none bg-card"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    {/* Output */}
                    <div className="flex-1 p-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Output</span>
                        </div>
                        <Card className="flex-1 p-4 font-mono text-sm overflow-auto bg-card whitespace-pre-wrap">
                            {output || <span className="text-muted-foreground italic">Run code to see output...</span>}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
