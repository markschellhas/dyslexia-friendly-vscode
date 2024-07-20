import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

async function getCurrentThemeData(): Promise<any> {
    const currentTheme = vscode.workspace.getConfiguration().get('workbench.colorTheme') as string;
    console.log('Current theme:', currentTheme);

    // If the current theme is already a Dyslexia Friendly theme, get the base theme name
    const baseThemeName = currentTheme.startsWith('Dyslexia Friendly (')
        ? currentTheme.substring('Dyslexia Friendly ('.length, currentTheme.length - 1)
        : currentTheme;

    for (const extension of vscode.extensions.all) {
        console.log('Checking extension:', extension.id);
        const themes = extension.packageJSON?.contributes?.themes;
        if (themes) {
            for (const theme of themes) {
                if (theme.label === baseThemeName || theme.id === baseThemeName) {
                    const themePath = path.join(extension.extensionPath, theme.path);
                    if (fs.existsSync(themePath)) {
                        return JSON.parse(fs.readFileSync(themePath, 'utf8'));
                    } else {
                        console.log('Theme file does not exist');
                    }
                }
            }
        }
    }
    console.log('No matching theme found');
    return null;
}

function registerFonts(context: vscode.ExtensionContext) {
    const fontFolder = path.join(context.extensionPath, 'fonts');
    const fonts = fs.readdirSync(fontFolder).filter(file => file.endsWith('.otf'));
    console.log('Found fonts:', fonts);

    // Instead of copying, we'll just log the fonts we found
    fonts.forEach(font => {
        console.log('Font available:', font);
    });

    // Return the path to the font folder
    return fontFolder;
}

export function activate(context: vscode.ExtensionContext) {
    // Register fonts
    const fontFolderPath = registerFonts(context);

    let disposable = vscode.commands.registerCommand('extension.changeToDyslexiaFriendly', async () => {

        registerFonts(context);

        const config = vscode.workspace.getConfiguration('dyslexiaFriendly');
        const editorConfig = vscode.workspace.getConfiguration('editor');

        if (config.get('useOpenDyslexicFont')) {
            const fontPath = path.join(fontFolderPath, 'OpenDyslexic-Regular.otf');
            await editorConfig.update('fontFamily', `'OpenDyslexic', '${fontPath}'`, vscode.ConfigurationTarget.Global);
        }

        // Apply font settings
        if (config.get('useOpenDyslexicFont')) {
            await editorConfig.update('fontFamily', 'OpenDyslexic', vscode.ConfigurationTarget.Global);
        }

        if (config.get('increaseFontSize')) {
            await editorConfig.update('fontSize', 14, vscode.ConfigurationTarget.Global);
        }

        if (config.get('increaseLetterSpacing')) {
            await editorConfig.update('letterSpacing', 0.5, vscode.ConfigurationTarget.Global);
        }

        // Disable font ligatures
        await editorConfig.update('fontLigatures', false, vscode.ConfigurationTarget.Global);

        // Get current theme data
        const currentThemeData = await getCurrentThemeData();
        console.log(currentThemeData);
        const currentThemeName = vscode.workspace.getConfiguration().get('workbench.colorTheme');

        if (currentThemeData) {
            // Create a new theme that combines current colors with dyslexia-friendly font styles
            let dyslexiaFriendlyTheme = {
                name: `Dyslexia Friendly (${currentThemeName})`,
                type: currentThemeData.type,
                colors: currentThemeData.colors,
                tokenColors: (currentThemeData.tokenColors || []).map((token: any) => ({
                    ...token,
                    settings: {
                        ...token.settings,
                        fontStyle: 'normal',
                    }
                }))
            };

            dyslexiaFriendlyTheme.tokenColors.push(
                {
                    scope: ["variable.language", "markup.italic", "emphasis"],
                    settings: { "fontStyle": "bold" }
                },
                {
                    scope: ["keyword", "storage", "entity.name.type"],
                    settings: { fontStyle: "normal" }
                },
                {
                    scope: ["entity.name.function", "support.function"],
                    settings: { fontStyle: "bold" }
                });


            // Write the new theme to a file
            const themePath = path.join(context.extensionPath, 'dyslexia-friendly-current-theme.json');
            fs.writeFileSync(themePath, JSON.stringify(dyslexiaFriendlyTheme, null, 2));

            // Apply the new theme
            await vscode.workspace.getConfiguration().update('workbench.colorTheme', `Dyslexia Friendly (${currentThemeName})`, vscode.ConfigurationTarget.Global);

            // Force an editor reload to apply changes
            await vscode.commands.executeCommand('workbench.action.reloadWindow');

            vscode.window.showInformationMessage('Dyslexia-friendly settings applied. VS Code will reload.');

        } else {
            vscode.window.showErrorMessage('Unable to read current theme data. Dyslexia-friendly font styles could not be applied.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }