from app.board import Board
import random

class Session():
    def __init__(self, name, bingoRule, words):
        self._name = name
        self._players = {}
        self._bingoRule = bingoRule
        self._words = words
        
    
    @property
    def name(self):
        return self._name
    
    @property
    def players(self):
        return self._players
    
    def generateWordSet(self):
        return random.sample(self._words, 3 * 3)

    def addPlayer(self, name):
        self._players[name] = Board(3,3)
    
    def toggle(self, name, x, y):
        self._players.get(name).togglePoint(x,y)

    def bingo(self, name):
        board = self._players.get(name)
        if self._bingoRule == 'regular':
            return board.hasVerticalBingo() or board.hasHorizontalBingo()
        if self._bingoRule == 'blackout':
            return board.hasBingoBlackout()
        
    