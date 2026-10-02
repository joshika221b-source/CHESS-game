# ♟️ Chess Game

A browser-based chess game built using **HTML, CSS, and JavaScript**, with custom game logic implemented from scratch.

## 🌐 Live Demo

### 👉 [♟️ CLICK HERE TO PLAY CHESS](https://joshika221b-source.github.io/Chess-Game/)

## 🎮 Features

* Interactive 8×8 chessboard
* White always moves first
* Click-to-move and drag-and-drop controls
* Individual movement logic for all chess pieces
* White and Black turn management
* Legal move validation
* Piece capturing
* Check detection
* Checkmate detection
* Stalemate detection
* Castling
* En passant
* Pawn promotion to Queen, Rook, Bishop, or Knight
* Highlighting for selected pieces and possible moves
* Check indication for the king
* Game reset functionality
* Game summary and score tracking

## 🛠️ Technologies Used

* **HTML5** – Game structure
* **CSS3** – Chessboard design and styling
* **JavaScript** – Game state, movement rules, interactions, and chess logic

## 📂 Project Structure

```text
Chess-Game/
│
├── index.html
├── styles.css
├── app.js
├── pieces.js
└── README.md
```

## 🧠 Game Logic

The game maintains the board state using JavaScript and tracks each piece's type, color, and movement status.

The game also handles:

* Player turns
* Legal moves
* Captures
* Check and checkmate
* Stalemate
* Castling
* En passant
* Pawn promotion
* Game statistics

Before a move is completed, the game checks whether the move is legal and ensures that the player's own king is not left in check.

## 🏆 Game Summary

At the end of the game, a summary displays:

* Number of moves
* Captured pieces
* Material points
* Checks given
* Promotions
* Castling
* Final score

## 🚀 Run Locally

Clone the repository:

```bash
git clone https://github.com/joshika221b-source/Chess-Game.git
```

Open the project in **VS Code** and launch `index.html` using **Live Server**.

## 📚 What I Learned

This project helped me practice:

* JavaScript DOM manipulation
* Event handling
* Drag-and-drop functionality
* Arrays and objects
* Conditional logic
* Application state management
* Implementing chess rules
* Debugging JavaScript
* Structuring a multi-file web project

## 🔮 Future Improvements

* Move history
* Undo/redo
* Chess timer
* Threefold repetition
* Fifty-move rule
* Improved animations
* AI opponent

## 👩‍💻 Author

**Joshika**

Built as a learning project to strengthen JavaScript and web development skills.
