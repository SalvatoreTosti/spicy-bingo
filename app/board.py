class Board():
    def __init__(self, width, height):
        self._width = width
        self._height = height
        
        board = []
        for i in range(self.width):
            column = []
            for j in range(self.height):
                column.append('')
            board.append(column)
        self._board = board  
        self._words = []      
    
    @property
    def width(self):
        return self._width    
        
    @property
    def height(self):
        return self._height
        
    @property
    def words(self):
        return self._words
    
    def setWords(self, words):
        self._words = words    
    
    def printBoard(self):
        for i in range(self.height):
            row = ''
            for j in range(self.width):
                row += ' ' + self._board[j][i]
            print(row)
    
    def toString(self):
        rows = ''
        for i in range(self.height):
            row = ''
            for j in range(self.width):
                row += ' ' + self._board[j][i]
            rows += row +'\n'
        return rows
            
    def togglePoint(self, x, y):
        if x < self.height and y < self.width:
            if not self._board[x][y]:
                self._board[x][y] = 'x'
            else:
                self._board[x][y] = ''
    
    def hasVerticalBingo(self):
        for i in range(self.width):
            if self._isBingoColumn(i):
                return True
        return False
    
    def _isBingoColumn(self, column):
        if column > self.height:
            return False
        for i in range(self.height):
            if not self._board[column][i]:
                return False
        return True
    
    def hasHorizontalBingo(self):
        for i in range(self.height):
            if self._isBingoRow(i):
                return True
        return False
                             
    def _isBingoRow(self, row):
        if row > self.width:
            return False
        for i in range(self.width):
            if not self._board[i][row]:
                return False
        return True
                       
    def hasBingoBlackout(self):
        for i in range(self.width):
            if not self.isBingoColumn(i):
                return False
        return True

