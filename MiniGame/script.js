class GomokuGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.boardSize = 15;
        
        this.initializeBoard();
        this.renderBoard();
        this.bindEvents();
    }

    initializeBoard() {
        this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(null));
    }

    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        const boardGrid = document.createElement('div');
        boardGrid.className = 'board-grid';
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.board[row][col]) {
                    cell.classList.add(this.board[row][col]);
                }
                
                boardGrid.appendChild(cell);
            }
        }
        
        gameBoard.appendChild(boardGrid);
    }

    bindEvents() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.addEventListener('click', (e) => this.handleCellClick(e));
        
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.addEventListener('click', () => this.restartGame());
    }

    handleCellClick(e) {
        if (this.gameOver) return;
        
        const cell = e.target;
        if (!cell.classList.contains('cell')) return;
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (this.board[row][col] !== null) return;
        
        this.makeMove(row, col);
    }

    makeMove(row, col) {
        this.board[row][col] = this.currentPlayer;
        this.renderBoard();
        
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.showWinMessage(`${this.currentPlayer === 'black' ? '黑棋' : '白棋'}获胜！`);
            return;
        }
        
        if (this.checkDraw()) {
            this.gameOver = true;
            this.showWinMessage('平局！');
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.updateCurrentPlayerDisplay();
    }

    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]],   // 水平
            [[1, 0], [-1, 0]],   // 垂直
            [[1, 1], [-1, -1]],  // 对角线
            [[1, -1], [-1, 1]]   // 反对角线
        ];
        
        const player = this.board[row][col];
        
        for (let direction of directions) {
            let count = 1;
            
            for (let [dx, dy] of direction) {
                let r = row + dx;
                let c = col + dy;
                
                while (r >= 0 && r < this.boardSize && 
                       c >= 0 && c < this.boardSize && 
                       this.board[r][c] === player) {
                    count++;
                    r += dx;
                    c += dy;
                }
            }
            
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }

    checkDraw() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    updateCurrentPlayerDisplay() {
        const currentPlayerDisplay = document.getElementById('current-player');
        currentPlayerDisplay.textContent = this.currentPlayer === 'black' ? '黑棋' : '白棋';
        currentPlayerDisplay.style.color = this.currentPlayer === 'black' ? '#000' : '#666';
    }

    showWinMessage(message) {
        const gameStatus = document.getElementById('game-status');
        gameStatus.textContent = message;
        gameStatus.classList.add('win-message');
    }

    restartGame() {
        this.initializeBoard();
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.renderBoard();
        this.updateCurrentPlayerDisplay();
        
        const gameStatus = document.getElementById('game-status');
        gameStatus.textContent = '';
        gameStatus.classList.remove('win-message');
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new GomokuGame();
});
