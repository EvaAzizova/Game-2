import sys
import random
import hashlib
import hmac

class Game:
    def __init__(self, moves):
        self.moves = moves
        self.rules = self.generate_rules()
        self.key = self.generate_key()
        self.computer_move = random.choice(moves)

    def generate_key(self):
        return hashlib.sha256(bytes(random.getrandbits(8) for _ in range(32))).digest()

    def generate_rules(self):
        num_moves = len(self.moves)
        middle = num_moves // 2
        rules = {}
        for i, move in enumerate(self.moves):
            winning_moves = [self.moves[(i + j) % num_moves] for j in range(1, middle + 1)]
            losing_moves = [self.moves[(i - j) % num_moves] for j in range(1, middle + 1)]
            rules[move] = {'win': winning_moves, 'lose': losing_moves}
        return rules

    def generate_hmac(self, move):
        return hmac.new(self.key, move.encode(), hashlib.sha256).hexdigest()

    def determine_winner(self, user_move):
        if user_move == self.computer_move:
            return "Draw"
        if user_move in self.rules[self.computer_move]['win']:
            return "You win!"
        return "Computer wins."

    def play(self):
        print("Available moves:")
        for i, move in enumerate(self.moves):
            print(f"{i + 1} - {move}")
        print("0 - Exit")
        
        while True:
            try:
                choice = int(input("Enter your move: "))
                if choice == 0:
                    print("Exiting the game.")
                    return
                elif 1 <= choice <= len(self.moves):
                    user_move = self.moves[choice - 1]
                    hmac_value = self.generate_hmac(user_move)
                    
                    print(f"Your move: {user_move}")
                    print(f"Computer's move: {self.computer_move}")
                    print(f"HMAC key: {self.key.hex()}")
                    print(f"HMAC: {hmac_value}")
                    
                    result = self.determine_winner(user_move)
                    print(f"Result: {result}")
                    return
                else:
                    print("Invalid input. Please enter a valid choice.")
            except ValueError:
                print("Invalid input. Please enter a valid choice.")

if __name__ == "__main__":
    if len(sys.argv) < 4 or len(sys.argv) % 2 != 1:
        print("Usage: python game.py move1 move2 move3 ...")
        sys.exit(1)

    moves = sys.argv[1:]
    game = Game(moves)
    game.play()
