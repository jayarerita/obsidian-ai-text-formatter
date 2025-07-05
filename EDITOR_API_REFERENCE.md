# Obsidian Editor API Reference

## Common Editor Operations

### Text Selection and Replacement

```typescript
import { Editor } from 'obsidian';

// Get selected text
const selectedText = editor.getSelection();

// Get cursor positions
const selectionStart = editor.getCursor('from');
const selectionEnd = editor.getCursor('to');

// Replace selected text
editor.replaceRange(newText, selectionStart, selectionEnd);

// Set cursor position
editor.setCursor({ line: 0, ch: 0 });
```

### Position Calculations

```typescript
// Calculate new cursor position after text replacement
const lines = newText.split('\n');
const newEndPos = {
    line: selectionStart.line + lines.length - 1,
    ch: lines.length === 1 
        ? selectionStart.ch + newText.length 
        : lines[lines.length - 1].length
};
```

## Important Notes

### ❌ Don't Use These (CodeMirror methods not available in Obsidian)
```typescript
// These don't exist in Obsidian's Editor interface:
editor.operation(() => { ... });  // ❌ Not available
editor.doc.replaceRange(...);     // ❌ Not available
editor.focus();                   // ❌ Not available
```

### ✅ Use These Instead (Obsidian Editor methods)
```typescript
// Correct Obsidian Editor API usage:
editor.replaceRange(text, from, to);  // ✅ Correct
editor.getSelection();                // ✅ Correct
editor.getCursor('from');             // ✅ Correct
editor.setCursor(pos);                // ✅ Correct
```

## Editor Callback Types

### Command Registration
```typescript
this.addCommand({
    id: 'my-command',
    name: 'My Command',
    editorCallback: (editor: Editor) => {
        // editor is properly typed as Editor
        const text = editor.getSelection();
    }
});
```

### Context Menu
```typescript
this.registerEvent(
    this.app.workspace.on('editor-menu', (menu, editor: Editor) => {
        // editor is properly typed as Editor
        menu.addItem((item) => {
            item.onClick(() => {
                const text = editor.getSelection();
            });
        });
    })
);
```

## Error Prevention

### Always Check for Text Selection
```typescript
const selectedText = editor.getSelection();
if (!selectedText || selectedText.trim().length === 0) {
    // Handle no selection case
    return;
}
```

### Proper Error Handling
```typescript
try {
    editor.replaceRange(newText, from, to);
    editor.setCursor(newPos);
} catch (error) {
    console.error('Editor operation failed:', error);
    // Handle error appropriately
}
```

## Fixed Issues

### Issue: `editor.operation is not a function`
**Problem**: Trying to use CodeMirror's `operation()` method which doesn't exist in Obsidian's Editor interface.

**Solution**: Remove the `operation()` wrapper and use editor methods directly:

```typescript
// ❌ Wrong (causes error)
editor.operation(() => {
    editor.replaceRange(text, from, to);
    editor.setCursor(pos);
});

// ✅ Correct
editor.replaceRange(text, from, to);
editor.setCursor(pos);
```

### Issue: Editor parameter typed as `any`
**Problem**: Using `any` type loses type safety and IntelliSense.

**Solution**: Import and use proper `Editor` type:

```typescript
// ❌ Wrong
import { Plugin } from 'obsidian';
function myFunction(editor: any) { ... }

// ✅ Correct
import { Plugin, Editor } from 'obsidian';
function myFunction(editor: Editor) { ... }
```

## Best Practices

1. **Always import Editor type**: `import { Editor } from 'obsidian'`
2. **Type editor parameters properly**: Use `Editor` instead of `any`
3. **Don't use CodeMirror methods**: Stick to Obsidian's Editor interface
4. **Handle edge cases**: Check for empty selections, handle errors
5. **Calculate positions correctly**: Account for multi-line text replacements
