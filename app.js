const gameBoard = document.querySelector("#gameBoard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
const pieceSvg = { king, queen, bishop, rook, knight, pawn }

// Board state: each square is null or { type, color, moved }
let board, playerGo, enPassant, gameOver, selected

const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']

function newGame() {
    board = Array(64).fill(null)
    for (let c = 0; c < 8; c++) {
        board[c] = { type: backRow[c], color: 'black', moved: false }
        board[8 + c] = { type: 'pawn', color: 'black', moved: false }
        board[48 + c] = { type: 'pawn', color: 'white', moved: false }
        board[56 + c] = { type: backRow[c], color: 'white', moved: false }
    }
    playerGo = 'white'          // white always moves first
    enPassant = null            // square a pawn can be captured on en passant
    gameOver = false
    selected = null
    stats = freshStats()
    pendingPromotion = null
    document.querySelector('#promotion').hidden = true
    document.querySelector('#scores').hidden = true
    infoDisplay.textContent = ''
    render()
}

const rowOf = i => Math.floor(i / width)
const colOf = i => i % width
const idx = (r, c) => r * width + c
const onBoard = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8
const other = color => color === 'white' ? 'black' : 'white'

// ---------- move generation ----------
function pseudoMoves(b, from, ep, attacksOnly = false) {
    const p = b[from]
    if (!p) return []
    const r = rowOf(from), c = colOf(from), moves = []
    const add = (rr, cc) => {
        if (!onBoard(rr, cc)) return false
        const t = b[idx(rr, cc)]
        if (!t) { moves.push(idx(rr, cc)); return true }
        if (t.color !== p.color) moves.push(idx(rr, cc))
        return false
    }
    const slide = dirs => dirs.forEach(([dr, dc]) => {
        let rr = r + dr, cc = c + dc
        while (add(rr, cc)) { rr += dr; cc += dc }
    })

    switch (p.type) {
        case 'pawn': {
            const dir = p.color === 'white' ? -1 : 1
            for (const dc of [-1, 1]) {
                const rr = r + dir, cc = c + dc
                if (!onBoard(rr, cc)) continue
                const t = b[idx(rr, cc)]
                if (attacksOnly || (t && t.color !== p.color) || idx(rr, cc) === ep) moves.push(idx(rr, cc))
            }
            if (!attacksOnly && onBoard(r + dir, c) && !b[idx(r + dir, c)]) {
                moves.push(idx(r + dir, c))
                const startRow = p.color === 'white' ? 6 : 1
                if (r === startRow && !b[idx(r + 2 * dir, c)]) moves.push(idx(r + 2 * dir, c))
            }
            break
        }
        case 'knight':
            [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]].forEach(([dr, dc]) => add(r + dr, c + dc))
            break
        case 'bishop': slide([[1,1],[1,-1],[-1,1],[-1,-1]]); break
        case 'rook': slide([[1,0],[-1,0],[0,1],[0,-1]]); break
        case 'queen': slide([[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]); break
        case 'king':
            for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (dr || dc) add(r + dr, c + dc)
            if (!attacksOnly && !p.moved && !isAttacked(b, from, other(p.color))) {
                // castling
                const rookK = b[idx(r, 7)], rookQ = b[idx(r, 0)]
                if (rookK && rookK.type === 'rook' && !rookK.moved && !b[idx(r,5)] && !b[idx(r,6)] &&
                    !isAttacked(b, idx(r,5), other(p.color)) && !isAttacked(b, idx(r,6), other(p.color)))
                    moves.push(idx(r, 6))
                if (rookQ && rookQ.type === 'rook' && !rookQ.moved && !b[idx(r,1)] && !b[idx(r,2)] && !b[idx(r,3)] &&
                    !isAttacked(b, idx(r,3), other(p.color)) && !isAttacked(b, idx(r,2), other(p.color)))
                    moves.push(idx(r, 2))
            }
            break
    }
    return moves
}

function isAttacked(b, square, byColor) {
    for (let i = 0; i < 64; i++) {
        if (b[i] && b[i].color === byColor && pseudoMoves(b, i, null, true).includes(square)) return true
    }
    return false
}

function inCheck(b, color) {
    const k = b.findIndex(p => p && p.type === 'king' && p.color === color)
    return isAttacked(b, k, other(color))
}

// Applies a move to a board copy and returns { board, enPassant }
function applyMove(b, from, to, ep, promoteTo = 'queen') {
    const nb = b.map(p => p && { ...p })
    const p = nb[from]
    // en passant capture
    if (p.type === 'pawn' && to === ep && !nb[to]) nb[idx(rowOf(from), colOf(to))] = null
    // castling: move rook too
    if (p.type === 'king' && Math.abs(colOf(to) - colOf(from)) === 2) {
        const r = rowOf(from)
        const [rf, rt] = colOf(to) === 6 ? [7, 5] : [0, 3]
        nb[idx(r, rt)] = { ...nb[idx(r, rf)], moved: true }
        nb[idx(r, rf)] = null
    }
    nb[to] = { ...p, moved: true }
    nb[from] = null
    // promotion
    if (p.type === 'pawn' && (rowOf(to) === 0 || rowOf(to) === 7)) nb[to].type = promoteTo
    const newEp = p.type === 'pawn' && Math.abs(rowOf(to) - rowOf(from)) === 2
        ? idx((rowOf(to) + rowOf(from)) / 2, colOf(from)) : null
    return { board: nb, enPassant: newEp }
}

function legalMoves(from) {
    const p = board[from]
    if (!p) return []
    return pseudoMoves(board, from, enPassant).filter(to => !inCheck(applyMove(board, from, to, enPassant).board, p.color))
}

function hasAnyMove(color) {
    for (let i = 0; i < 64; i++) if (board[i] && board[i].color === color && legalMoves(i).length) return true
    return false
}

// ---------- making moves ----------
const values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 }
let stats, pendingPromotion = null

function freshStats() {
    const s = () => ({ moves: 0, captured: [], points: 0, checks: 0, promotions: 0, castles: 0 })
    return { white: s(), black: s() }
}

function makeMove(from, to, promoteTo) {
    if (gameOver || pendingPromotion || !board[from] || board[from].color !== playerGo) return
    if (!legalMoves(from).includes(to)) {
        infoDisplay.textContent = 'That move is not allowed'
        setTimeout(() => { if (!gameOver) infoDisplay.textContent = '' }, 1500)
        return
    }
    const p = board[from]
    if (p.type === 'pawn' && (rowOf(to) === 0 || rowOf(to) === 7) && !promoteTo) {
        showPromotionPicker(from, to, p.color)
        return
    }
    const st = stats[playerGo]
    let victim = board[to]
    if (!victim && p.type === 'pawn' && to === enPassant) victim = board[idx(rowOf(from), colOf(to))]
    if (victim) { st.captured.push(victim.type); st.points += values[victim.type] }
    if (p.type === 'king' && Math.abs(colOf(to) - colOf(from)) === 2) st.castles++
    if (promoteTo) st.promotions++
    st.moves++

    const result = applyMove(board, from, to, enPassant, promoteTo)
    board = result.board
    enPassant = result.enPassant
    playerGo = other(playerGo)
    selected = null
    if (inCheck(board, playerGo)) st.checks++

    if (!hasAnyMove(playerGo)) {
        gameOver = true
        const mate = inCheck(board, playerGo)
        infoDisplay.textContent = mate
            ? `Checkmate! ${other(playerGo)} wins 🎉`
            : 'Stalemate — it is a draw'
        showScores(mate ? other(playerGo) : null)
    } else {
        infoDisplay.textContent = inCheck(board, playerGo) ? `${playerGo} is in check!` : ''
    }
    render()
}

function showPromotionPicker(from, to, color) {
    pendingPromotion = true
    const box = document.querySelector('#promotion')
    box.innerHTML = '<p>Promote pawn to:</p>'
    const row = document.createElement('div')
    row.className = 'promo-row'
    for (const type of ['queen', 'rook', 'bishop', 'knight']) {
        const btn = document.createElement('button')
        btn.className = 'promo-btn'
        btn.title = type
        btn.innerHTML = pieceSvg[type]
        btn.firstElementChild.classList.add(color)
        btn.addEventListener('click', () => {
            pendingPromotion = null
            box.hidden = true
            makeMove(from, to, type)
        })
        row.append(btn)
    }
    box.append(row)
    box.hidden = false
}

function showScores(winner) {
    const box = document.querySelector('#scores')
    const symbols = { pawn: '♟', knight: '♞', bishop: '♝', rook: '♜', queen: '♛' }
    const card = color => {
        const s = stats[color]
        // performance score: material + bonuses + result
        const score = s.points * 10 + s.checks * 5 + s.promotions * 15 + s.castles * 5
            + (winner === color ? 100 : winner === null ? 50 : 0)
        return `<div class="score-card ${winner === color ? 'winner' : ''}">
            <h3>${color[0].toUpperCase() + color.slice(1)}${winner === color ? ' 🏆' : ''}</h3>
            <div class="big">${score}</div>
            <ul>
              <li>Moves: ${s.moves}</li>
              <li>Material won: ${s.points} pts</li>
              <li>Captured: ${s.captured.map(t => symbols[t]).join(' ') || '—'}</li>
              <li>Checks given: ${s.checks}</li>
              <li>Promotions: ${s.promotions}</li>
              <li>Castled: ${s.castles ? 'yes' : 'no'}</li>
            </ul>
        </div>`
    }
    box.innerHTML = `<h2>Game summary</h2><div class="score-row">${card('white')}${card('black')}</div>
        <p class="note">Score = material×10 + checks×5 + promotions×15 + castling 5 + win 100 / draw 50</p>`
    box.hidden = false
}

// ---------- drawing the board ----------
function render() {
    gameBoard.innerHTML = ''
    playerDisplay.textContent = playerGo
    const hints = selected !== null ? legalMoves(selected) : []
    const checkedKing = inCheck(board, playerGo)
        ? board.findIndex(p => p && p.type === 'king' && p.color === playerGo) : -1

    board.forEach((piece, i) => {
        const square = document.createElement('div')
        square.classList.add('square', (rowOf(i) + colOf(i)) % 2 === 0 ? 'beige' : 'brown')
        square.setAttribute('square-id', i)
        if (i === selected) square.classList.add('selected')
        if (hints.includes(i)) square.classList.add('hint')
        if (hints.includes(i) && piece) square.classList.add('capture')
        if (i === checkedKing) square.classList.add('in-check')

        if (piece) {
            square.innerHTML = pieceSvg[piece.type]
            const el = square.firstElementChild
            el.classList.add(piece.color)
            if (piece.color === playerGo && !gameOver) {
                el.setAttribute('draggable', true)
                el.addEventListener('dragstart', e => {
                    selected = i
                    e.dataTransfer.setData('text/plain', i)
                })
            }
        }

        square.addEventListener('dragover', e => e.preventDefault())
        square.addEventListener('drop', e => {
            e.preventDefault()
            makeMove(Number(e.dataTransfer.getData('text/plain')), i)
        })
        // click-to-move also works
        square.addEventListener('click', () => {
            if (piece && piece.color === playerGo) { selected = i; render() }
            else if (selected !== null) makeMove(selected, i)
        })
        gameBoard.append(square)
    })
}

document.querySelector('#reset').addEventListener('click', newGame)
newGame()
