// Tela

const screen = document.querySelector('canvas#screen')
const widthScene = screen.width = '25'
const heightScene = screen.height = '25'
const context = screen.getContext('2d')

// HUD
const lifeBar = document.getElementById('lifeBar')
const manaBar = document.getElementById('manaBar')
const killBar = document.getElementById('killBar')
const difficultBar = document.getElementById('difficultBar')
const manabutton = document.querySelector('button#manabutton')
const lifebutton = document.querySelector('button#lifebutton')
const startStop = document.querySelector('button#startStop')
// Objetos

var idAdd = 0
const game = {
    lifePoints: 10,
    manaPoints: 250,
    kills: 0,
    difficult: 0
}
const state = {
    player: {
        'player': { x: 1, y: 1, color: 'blue' },
    },
    wall: {
    },
    fruit: {
    },
    fireball: {}
}

// Inputs
document.addEventListener('keydown', handleKeydown)

var player = state.player['player']

function handleKeydown(event) {
    const tecla = event.key
    if (acceptedMoves[tecla] == undefined) return
    const actionsPlayer = acceptedMoves[tecla]
    actionsPlayer(player, tecla)
}
const acceptedMoves = {
    ArrowUp(player, tecla) {
        if (player.y > 0) {
            player.y--
        }
    },
    ArrowDown(player, tecla) {
        if (player.y + 1 < heightScene) {
            player.y++
        }
    },
    ArrowLeft(player, tecla) {
        if (player.x > 0) {
            player.x--
        }
    },
    ArrowRight(player, tecla) {
        if (player.x + 1 < widthScene) {
            player.x++
        }
    },
    f(player) {
        if (game['manaPoints'] >= 50) {
            let fireballid = `fireball${idAdd}`
            idAdd++
            state['fireball'][fireballid] = { x: player.x + 1, y: player.y, color: 'red' }
            const fireballWay = setInterval(() => {
                if (!state['fireball'][fireballid]) return
                state['fireball'][fireballid]['x']++;
            }, 100)
            const collision = setInterval(() => {
                for (const fireballId in state.fireball) {
                    const fireball = state.fireball[fireballId]
                    for (const fruitId in state.fruit) {
                        const fruit = state.fruit[fruitId]

                        if (fireball.x == fruit.x && fireball.y == fruit.y) {
                            delete state.fruit[fruitId]
                            game['kills']++
                        }
                    }
                    for (const wallId in state.wall) {
                        const wall = state.wall[wallId]
                        if (fireball.x == wall.x && fireball.y == wall.y) {
                            delete state.fireball[fireballId]
                            clearInterval(fireballWay)
                            clearTimeout(fireballTime)
                            clearTimeout(fireballColor1)
                            clearTimeout(fireballColor2)
                        }
                    }
                }
            }, 50)
            const fireballColor1 = setTimeout(() => { state.fireball[fireballid]['color'] = 'orange' }, 1200)
            const fireballColor2 = setTimeout(() => { state.fireball[fireballid]['color'] = 'yellow' }, 1400)
            const fireballTime = setTimeout(() => { delete state.fireball[fireballid]; clearInterval(fireballWay); clearInterval(collision) }, 1500)
            game['manaPoints'] = game['manaPoints'] - 50
        }
    },
}

// Game

function manaRestauration() {
    if (game['manaPoints'] <= 190) {
        game['manaPoints'] += 10
    }
    lifeBar.innerHTML = `<strong>Life:</strong>${game['lifePoints']}`
    manaBar.innerHTML = `<strong>Mana:</strong>${game['manaPoints']}`
    killBar.innerHTML = `<strong>Kills:</strong>${game['kills']}`
    difficultBar.innerHTML = `<strong>Dificuldade:</strong>${game['difficult']}`
}
setInterval(manaRestauration, 500)


function checkCollisionWall() {
    let player = state.player['player']
    for (const fruitId in state.fruit) {
        let fruit = state.fruit[fruitId]
        if (player.y == fruit.y && player.x == fruit.x) {
            game['lifePoints']--
            if (game['lifePoints'] <= 0) {
                startGame()
                window.location.reload()
            }
        }

    }
}
setInterval(checkCollisionWall, 500)

var gameStarted = false
function startGame() {
    if (gameStarted) {
        startStop.innerHTML = 'Start Game'
        startStop.className = 'btn btn-success'
        gameStarted = false
        clearGame()
        clearInterval(comeco)
        return;
    }
    if (!gameStarted) {
        startStop.innerHTML = 'Stop Game'
        startStop.className = 'btn btn-danger'
        gameStarted = true
        game['lifePoints'] = 10
        game['difficult']++
        var comeco = setInterval(gamezin, 3000)
        return comeco;
    }
}
function clearGame() {
    for (let fruitId in state.fruit) {
        delete state.fruit[fruitId]
    }
}
function gamezin() {
    if (!gameStarted) return
    let fruitId = `fruit${idAdd}`
    idAdd++
    let rY = getRandom()
    var zombie = state['fruit'][fruitId] = { x: 24, y: rY }
    setInterval(andar(zombie), 1000)
}
function andar(zombie) {
    if (zombie) {
        var passos = setInterval(() => {
            zombie['x']--
            if (zombie['x'] <= -1) {
                game['lifePoints']--
                clearInterval(passos);
                delete zombie
                return
            }
            if (!gameStarted) {
                clearInterval(passos);
                return
            }
        }, 1000)
    }
}
function getRandom() {
    return Math.floor(Math.random() * (heightScene - 0) + 0)
}
function manaToggle() {
    if (game['manaPoints'] < 300) {
        game['manaPoints'] = Infinity
        manabutton.innerHTML = 'Mana Finita'
    } else if (game['manaPoints'] == Infinity) {
        game['manaPoints'] = 250
        manabutton.innerHTML = 'Mana Infinita'
    }
}
function lifeToggle() {
    if (game['lifePoints'] < 11) {
        game['lifePoints'] = Infinity
        lifebutton.innerHTML = 'Vida Finita'
    } else if (game['lifePoints'] == Infinity) {
        game['lifePoints'] = 10
        lifebutton.innerHTML = 'Vida Infinita'
    }
}
// Renderizar e atualizar tela

renderScreen()
function renderScreen() {
    context.fillStyle = 'white'
    context.clearRect(0, 0, widthScene, heightScene)
    for (const fruitId in state.fruit) {
        const fruit = state.fruit[fruitId]
        context.fillStyle = 'green'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }
    for (const playerId in state.player) {
        const player = state.player[playerId]
        context.fillStyle = player.color
        context.fillRect(player.x, player.y, 1, 1)
    }
    for (const fireballId in state.fireball) {
        const fireball = state.fireball[fireballId]
        context.fillStyle = fireball.color
        context.fillRect(fireball.x, fireball.y, 1, 1)
    }
    for (const wallId in state.wall) {
        const wall = state.wall[wallId]
        context.fillStyle = 'black'
        context.fillRect(wall.x, wall.y, 1, 1)
    }

    requestAnimationFrame(renderScreen)
}
