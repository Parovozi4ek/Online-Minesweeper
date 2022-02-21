let matrix = null
let running = null
timerid = false
init(10, 10, 10)

document
    .querySelector('button')
    .addEventListener('click', () => init(10, 10, 10))

function init(columns, rows, mines) {
    matrix = getMatrix(columns, rows)
    running = true
    first_click = true
    document.getElementById("timer").childNodes[0].nodeValue = 0;
    if (timerid) {
        clearInterval(timerid)
    }

    for (let i = 0; i < mines; i++) {
        setRandomMine(matrix)
    }
    update()
}

function time() {
    sec = 0;
    timerid = setInterval(() => tick(), 1000);
}

function tick() {
    sec++;
    document.getElementById("timer").childNodes[0].nodeValue = sec;
}

function update() {
    if (!running) {
        return
    }

    const gameElement = matrixToHtml(matrix)
    const appElement = document.querySelector('#app')
    appElement.innerHTML = ''
    appElement.append(gameElement)

    appElement
        .querySelectorAll('img')
        .forEach(imgElement => {
            imgElement.addEventListener('mousedown', mousedownHandler)
            imgElement.addEventListener('mouseup', mouseupHandler)
            imgElement.addEventListener('mouseleave', mouseleaveHandler)
        })

    if (isLosing(matrix)) {
        alert('Увы! Вы проиграли')
        running = false
        clearInterval(timerid)
    }

    else if (isWin(matrix)) {
        Ajax()
        alert('Мои поздравления! Вы победили!')
        running = false
        clearInterval(timerid)
    }
}

function mousedownHandler(event) {
    const { cell, left, right } = getInfo(event)

    if (left) {
        cell.left = true
    }

    if (right) {
        cell.right = true
    }

    if (cell.left && cell.right) {
        bothHandler(cell)
    }

}

function mouseupHandler(event) {
    const { left, right, cell } = getInfo(event)
    const both = cell.right && cell.left && (left || right)
    const leftMouse = !both && cell.left && left
    const rightMouse = !both && cell.right && right

    if (first_click) {
        time()
        first_click = false
    }

    if (both) {
        forEach(matrix, x => x.poten = false)
    }

    if (left) {
        cell.left = false
    }

    if (right) {
        cell.right = false
    }

    if (leftMouse) {
        leftHandler(cell)
    }

    else if (rightMouse) {
        rightHandler(cell)
    }

}

function mouseleaveHandler(event) {
    const info = getInfo(event)

    info.cell.left = false
    info.cell.right = false

}

function getInfo(event) {
    const element = event.target
    const cellId = parseInt(element.getAttribute('data-cell-id'))
    return {
        left: event.which === 1,
        right: event.which === 3,
        cell: getCellById(matrix, cellId)
    }
}

function leftHandler(cell) {
    if (cell.show || cell.flag) {
        return
    }
    cell.show = true
    showSpread(matrix, cell.x, cell.y)
    update()
}

function rightHandler(cell) {
    if (!cell.show) {
        cell.flag = !cell.flag
    }
    update()
}

function bothHandler(cell) {
    if (!cell.show || !cell.number) {
        return
    }

    const cells = getAroundCells(matrix, cell.x, cell.y)
    const flags = cells.filter(x => x.flag).length

    if (flags === cell.number) {
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(cell => {
                cell.show = true
                showSpread(matrix, cell.x, cell.y)
            })
    }

    else {
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(cell => cell.poten = true)
    }
    update()
}

function getMatrix(columns, rows) {
    const matrix = []

    let idCounter = 1

    for (let y = 0; y < rows; y++) {
        const row = []

        for (let x = 0; x < columns; x++) {
            row.push({
                id: idCounter++,
                left: false,
                right: false,
                show: false,
                flag: false,
                mine: false,
                poten: false,
                number: 0,
                x,
                y
            })
        }

        matrix.push(row)
    }

    return matrix
}

function getRandomFreeCell(matrix) {
    const freeCells = []

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const cell = matrix[y][x]

            if (!cell.mine) {
                freeCells.push(cell)
            }
        }
    }

    const index = Math.floor(Math.random() * freeCells.length)
    return freeCells[index]
}

function setRandomMine(matrix) {
    const cell = getRandomFreeCell(matrix)
    cell.mine = true

    const cells = getAroundCells(matrix, cell.x, cell.y)

    for (const cell of cells) {
        cell.number += 1
    }
}

function getCell(matrix, x, y) {
    if (!matrix[y] || !matrix[y][x]) {
        return false
    }

    return matrix[y][x]
}

function getAroundCells(matrix, x, y) {
    const cells = []

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) {
                continue
            }

            const cell = getCell(matrix, x + dx, y + dy)

            if (cell) {
                cells.push(cell)
            }

        }
    }

    return cells
}

function getCellById(matrix, id) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const cell = matrix[y][x]

            if (cell.id === id) {
                return cell
            }
        }
    }

    return false
}

function matrixToHtml(matrix) {
    const gameElement = document.createElement('div')
    gameElement.classList.add('sapper')

    for (let y = 0; y < matrix.length; y++) {
        const rowElement = document.createElement('div')
        rowElement.classList.add('row')

        for (let x = 0; x < matrix[y].length; x++) {
            const cell = matrix[y][x]
            const imgElement = document.createElement('img')

            imgElement.draggable = false
            imgElement.oncontextmenu = () => false
            imgElement.setAttribute('data-cell-id', cell.id)
            rowElement.append(imgElement)

            if (cell.flag) {
                imgElement.src = '/assets/flag.jpg'
                continue
            }

            if (cell.poten) {
                imgElement.src = '/assets/poten.jpg'
                continue
            }

            if (!cell.show) {
                imgElement.src = '/assets/cell.jpg'
                continue
            }

            if (cell.mine) {
                imgElement.src = '/assets/bomb.jpg'
                continue
            }

            if (cell.number) {
                imgElement.src = '/assets/number' + cell.number + '.jpg'
                continue
            }

            imgElement.src = '/assets/empty.jpg'

        }

        gameElement.append(rowElement)
    }

    return gameElement
}

function forEach(matrix, handler) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            handler(matrix[y][x])
        }
    }
}

function showSpread(matrix, x, y) {
    const cell = getCell(matrix, x, y)

    if (cell.flag || cell.number || cell.mine) {
        return
    }

    forEach(matrix, x => x._marked = false)

    cell._marked = true

    let flag = true
    while (flag) {
        flag = false

        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix.length; x++) {
                const cell = matrix[y][x]

                if (!cell._marked || cell.number) {
                    continue
                }

                const cells = getAroundCells(matrix, x, y)
                for (const cell of cells) {
                    if (cell._marked) {
                        continue
                    }

                    if (!cell.flag && !cell.mine) {
                        cell._marked = true
                        flag = true
                    }
                }
            }
        }
    }

    forEach(matrix, x => {
        if (x._marked) {
            x.show = true
        }
        delete x._marked
    })
}

function isWin(matrix) {
    const flags = []
    const mines = []

    forEach(matrix, cell => {
        if (cell.flag) {
            flags.push(cell)
        }

        if (cell.mine) {
            mines.push(cell)
        }
    })

    if (flags.length !== mines.length) {
        return false
    }

    for (const cell of mines) {
        if (!cell.flag) {
            return false
        }
    }

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const cell = matrix[y][x]

            if (!cell.mine && !cell.show) {
                return false
            }
        }
    }

    return true
}

function isLosing(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const cell = matrix[y][x]

            if (cell.mine && cell.show) {
                return true
            }
        }
    }

    return false

}
