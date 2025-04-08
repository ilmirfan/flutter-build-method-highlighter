// extension.js
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Flutter Build Highlighter is now active');

	// Create decorator type for build method
	const buildMethodDecorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: 'rgba(255, 157, 0, 0.2)',
		border: '1px solid rgba(255, 157, 0, 0.6)',
		isWholeLine: true,
	});

	let activeEditor = vscode.window.activeTextEditor;
	let timeout = null;

	// Function to update decorations
	function updateDecorations() {
		if (!activeEditor) {
			return;
		}

		// Only apply to Dart files
		if (activeEditor.document.languageId !== 'dart') {
			return;
		}

		const text = activeEditor.document.getText();
		const buildMethodRegex = /Widget\s+build\s*\(\s*BuildContext\s+\w+\s*\)\s*{/g;

		const buildMatches = [];
		let match;

		while ((match = buildMethodRegex.exec(text))) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);
			const decoration = {
				range: new vscode.Range(startPos, endPos)
			};
			buildMatches.push(decoration);
		}

		activeEditor.setDecorations(buildMethodDecorationType, buildMatches);
	}

	// Update decorations when the active editor changes
	if (activeEditor) {
		updateDecorations();
	}

	// Update decorations when the active editor changes
	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			updateDecorations();
		}
	}, null, context.subscriptions);

	// Update decorations when the document changes
	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			timeout = setTimeout(updateDecorations, 500);
		}
	}, null, context.subscriptions);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};