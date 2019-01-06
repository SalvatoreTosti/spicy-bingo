from app.board import Board
import random

class Session():
    def __init__(self, name, bingoRule, width, height, words):
        self._name = name
        self._players = {}
        self._bingoRule = bingoRule
        self._words = words
        self._width = width
        self._height = height
    
    @property
    def name(self):
        return self._name
    
    @property
    def players(self):
        return self._players
    
    @property
    def playerNames(self):
        return list(self._players.keys())
    
    @property
    def gridSize(self):
        if self._height == 3:
            return 'three'
        elif self._height == 5:
            return 'five'
        return 'three'
        
    def generateWordSet(self):
        totalWordCount = self._width * self._height
        words = self._words
        while len(words) < totalWordCount:
            words = words + words            
        return random.sample(words, totalWordCount)

    def addPlayer(self, name):
        if not self._players.get(name):
            self._players[name] = Board(self._width, self._height)
    
    def toggle(self, name, x, y):
        self._players.get(name).togglePoint(x,y)

    def bingo(self, name):
        board = self._players.get(name)
        if self._bingoRule == 'regular':
            return board.hasVerticalBingo() or board.hasHorizontalBingo()
        if self._bingoRule == 'blackout':
            return board.hasBingoBlackout()
        
    