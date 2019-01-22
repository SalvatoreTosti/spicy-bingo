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
    
    def setPlayerWords(self, name, words):
        if not self._players.get(name):
            self._players[name] = Board(self._width, self._height)
        self._players[name].setWords(words)    
    
    def getPlayerWords(self, name):
        if not self._players.get(name):
            return []
        return self._players[name].words
        
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
            
    def getToggledNumbers(self, name):
        if not self._players.get(name):
            self._players[name] = Board(self._width, self._height)
        return self._players[name].getToggledPointNumbers()
        
    def coordinateTranslate(self, number):
        if self._height == 3:
            lookup = {
                '0' : {'x': 0, 'y': 0},
                '1' : {'x': 1, 'y': 0},
                '2' : {'x': 2, 'y': 0},
                '3' : {'x': 0, 'y': 1},
                '4' : {'x': 1, 'y': 1},
                '5' : {'x': 2, 'y': 1},
                '6' : {'x': 0, 'y': 2},
                '7' : {'x': 1, 'y': 2},
                '8' : {'x': 2, 'y': 2}                
            }
            return lookup[number]

        elif self._height == 5:
            lookup = {
                '0' : {'x': 0, 'y': 0},
                '1' : {'x': 1, 'y': 0},
                '2' : {'x': 2, 'y': 0},      
                '3' : {'x': 3, 'y': 0},    
                '4' : {'x': 4, 'y': 0},
                
                '5' : {'x': 0, 'y': 1},
                '6' : {'x': 1, 'y': 1},
                '7' : {'x': 2, 'y': 1},      
                '8' : {'x': 3, 'y': 1},    
                '9' : {'x': 4, 'y': 1},   
                
                '10' : {'x': 0, 'y': 2},
                '11' : {'x': 1, 'y': 2},
                '12' : {'x': 2, 'y': 2},      
                '13' : {'x': 3, 'y': 2},    
                '14' : {'x': 4, 'y': 2},
            
                '15' : {'x': 0, 'y': 3},
                '16' : {'x': 1, 'y': 3},
                '17' : {'x': 2, 'y': 3},      
                '18' : {'x': 3, 'y': 3},    
                '19' : {'x': 4, 'y': 3},
                
                '20' : {'x': 0, 'y': 4},
                '21' : {'x': 1, 'y': 4},
                '22' : {'x': 2, 'y': 4},      
                '23' : {'x': 3, 'y': 4},    
                '24' : {'x': 4, 'y': 4},     
            }
            return lookup[number]            