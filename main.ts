import { Editor, Plugin, Menu, MarkdownView } from 'obsidian';
import { SYMBOL_CATEGORIES } from './symbols';

export default class InsertSymbolPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: 'insert-symbol',
            name: 'Insert Symbol',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.showCategoryMenu(editor, view);
            },
        });
    }

    showCategoryMenu(editor: Editor, view: MarkdownView) {
        const menu = new Menu();

        for (const category in SYMBOL_CATEGORIES) {
            menu.addItem((item) => {
                item.setTitle(category)
                    .onClick(() => {
                        this.showSymbolMenu(category, editor, view);
                    });
            });
        }

        const leaf = view.leaf as any;
        const editorView = leaf.view.editor.cm as any;
        const coords = editorView.coordsAtPos(editorView.state.selection.main.head);
        menu.showAtPosition({ x: coords.left, y: coords.top + 20 });
    }

    showSymbolMenu(category: string, editor: Editor, view: MarkdownView) {
        const menu = new Menu();
        const symbols = SYMBOL_CATEGORIES[category as keyof typeof SYMBOL_CATEGORIES];

        symbols.forEach((symbol) => {
            menu.addItem((item) => {
                item.setTitle(`${symbol.name} (${symbol.symbol})`)
                    .onClick(() => {
                        editor.replaceSelection(symbol.symbol);
                    });
            });
        });

        const leaf = view.leaf as any;
        const editorView = leaf.view.editor.cm as any;
        const coords = editorView.coordsAtPos(editorView.state.selection.main.head);
        menu.showAtPosition({ x: coords.left, y: coords.top + 20 });
    }
}
