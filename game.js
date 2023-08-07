const crypto = require('crypto');

class MovesTable {
    constructor(moves) {
        this.moves = moves;
        this.table = this.generateTable();
    }

    generateTable() {
        const table = [['', ...this.moves]];
        for (const move of this.moves) {
            const row = [move];
            for (const otherMove of this.moves) {
                if (this.isWinningMove(move, otherMove)) {
                    row.push('Win');
                } else if (move === otherMove) {
                    row.push('Draw');
                } else {
                    row.push('Lose');
                }
            }
            table.push(row);
        }
        return table;
    }

    isWinningMove(move, otherMove) {
        const half = Math.floor(this.moves.length / 2);
        const startIndex = this.moves.indexOf(move);
        const endIndex = (startIndex + half) % this.moves.length;
        return this.moves.slice(startIndex + 1, startIndex + half + 1).includes(otherMove)
            || this.moves.slice(0, endIndex + 1).includes(otherMove);
    }

    printTable() {
        for (const row of this.table) {
            console.log(row.join('\t'));
        }
    }
}

class Game {
    constructor(moves) {
        this.moves = moves;
        this.movesTable = new MovesTable(this.moves);
        this.key = crypto.randomBytes(32);
    }

    generateMove() {
        return this.moves[Math.floor(Math.random() * this.moves.length)];
    }

    computeHmac(move) {
        const hmac = crypto.createHmac('sha256', this.key);
        hmac.update(move);
        return hmac.digest('hex');
    }

    play() {
        const computerMove = this.generateMove();
        console.log(`Computer's move: ${computerMove}`);

        const userMove = this.getUserMove();
        const hmacValue = this.computeHmac(userMove);
        console.log(`HMAC: ${hmacValue}`);

        const winner = this.movesTable.table[this.moves.indexOf(userMove) + 1][this.moves.indexOf(computerMove) + 1];
        console.log(`Winner: ${winner}`);
        console.log(`Key: ${this.key.toString('hex')}`);
    }

    getUserMove() {
        const readline = require('readline-sync');
        while (true) {
            console.log('Choose your move:');
            for (let i = 0; i < this.moves.length; i++) {
                console.log(`${i + 1} - ${this.moves[i]}`);
            }
            const choice = readline.questionInt();
            if (choice >= 1 && choice <= this.moves.length) {
                return this.moves[choice - 1];
            } else {
                console.log('Invalid choice. Please try again.');
            }
        }
    }
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 3 || args.length % 2 !== 1 || new Set(args).size !== args.length) {
        console.log('Invalid input. Please provide an odd number of unique moves.');
        return;
    }

    const game = new Game(args);
    game.movesTable.printTable();
    game.play();
}

main();
