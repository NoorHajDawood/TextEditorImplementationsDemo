# Text Editor Data Structure Demo

An interactive React application that demonstrates how different data structures handle text editing operations. This educational tool showcases the trade-offs between array-based, linked list-based, and gap buffer implementations.

## Features

### 🎯 Three Text Editor Implementations

1. **Array-Based Editor**
   - Simple array implementation
   - O(n) time complexity for insertions/deletions in the middle
   - Requires shifting elements when editing
   - Memory efficient but slow for large texts

2. **Linked List-Based Editor**
   - Doubly linked list implementation
   - O(1) time complexity for insertions/deletions
   - Higher memory overhead due to pointer storage
   - Fast editing but memory intensive

3. **Gap Buffer Editor**
   - Efficient gap buffer implementation
   - O(1) insertions/deletions at cursor position
   - Amortized O(1) cursor movement
   - Best balance of performance and memory usage

### 🎮 Interactive Features

- **Real-time editing**: Type characters and see how each implementation handles them
- **Visual cursor**: See the cursor position in each editor
- **Memory usage tracking**: Monitor memory consumption for linked list and gap buffer
- **Keyboard support**: Use arrow keys, backspace, and typing
- **Button controls**: Manual controls for all operations

## Getting Started

### Prerequisites

- Node.js (version 20.11.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd text-editor-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How to Use

### Basic Operations

1. **Inserting Text**: 
   - Type directly in the text area or use the input field
   - Characters are inserted at the current cursor position

2. **Moving Cursor**:
   - Use arrow keys (← →) or click the arrow buttons
   - Watch how each implementation handles cursor movement

3. **Deleting Text**:
   - Press Backspace or click the Delete button
   - Observe the different deletion strategies

### Understanding the Visualizations

- **Character boxes**: Each character is displayed in its own box
- **Cursor highlighting**: The current cursor position is highlighted in blue
- **Gap visualization**: The gap buffer shows the gap size and position
- **Memory usage**: Real-time memory consumption for applicable implementations

## Technical Details

### Data Structures

#### Array-Based Editor
```typescript
class ArrayBasedEditor {
  private content: string[] = [];
  private cursor: number = 0;
  
  insert(char: string): void {
    this.content.splice(this.cursor, 0, char);
    this.cursor++;
  }
}
```

#### Linked List Editor
```typescript
class LinkedListEditor {
  private head: ListNode | null = null;
  private cursor: ListNode | null = null;
  
  insert(char: string): void {
    // O(1) insertion at cursor position
  }
}
```

#### Gap Buffer Editor
```typescript
class GapBufferEditor {
  private beforeGap: string[] = [];
  private afterGap: string[] = [];
  private gapSize: number = 10;
  
  insert(char: string): void {
    // O(1) insertion using gap
  }
}
```

### Performance Characteristics

| Operation | Array | Linked List | Gap Buffer |
|-----------|-------|-------------|------------|
| Insert at cursor | O(n) | O(1) | O(1) |
| Delete at cursor | O(n) | O(1) | O(1) |
| Cursor movement | O(1) | O(1) | O(1) |
| Memory usage | Low | High | Medium |

## Educational Value

This demo helps understand:

- **Time complexity trade-offs** between different data structures
- **Memory usage patterns** in text editing
- **Real-world applications** of data structures
- **Performance implications** of design choices

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Modern CSS** with Grid and Flexbox
- **Responsive design** for all screen sizes

## Contributing

Feel free to contribute by:

1. Adding new data structure implementations
2. Improving the UI/UX
3. Adding more educational content
4. Fixing bugs or improving performance

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by real text editor implementations like Vim, Emacs, and modern code editors
- Educational materials on data structures and algorithms
- The React and Vite communities for excellent tooling
