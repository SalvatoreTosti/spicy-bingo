from app import app
from app.board import Board
import unittest

class BoardTestCase(unittest.TestCase):
    
    def test_boardSetup(self):
       board = Board(3,3)
       self.assertEqual(board.width, 3)
       self.assertEqual(board.height, 3)
    
    def test_HorizontalTopBingo(self):
       board = Board(3,3)
       board.togglePoint(0,0)
       board.togglePoint(1,0)
       board.togglePoint(2,0)
       self.assertTrue(board.hasHorizontalBingo())
    
    def test_HorizontalMiddleBingo(self):
       board = Board(3,3)
       board.togglePoint(0,1)
       board.togglePoint(1,1)
       board.togglePoint(2,1)
       self.assertTrue(board.hasHorizontalBingo())
    
    def test_HorizontalBottomBingo(self):
       board = Board(3,3)
       board.togglePoint(0,2)
       board.togglePoint(1,2)
       board.togglePoint(2,2)
       self.assertTrue(board.hasHorizontalBingo())
       
       
    def test_VerticalLeftBingo(self):
       board = Board(3,3)
       board.togglePoint(0,0)
       board.togglePoint(0,1)
       board.togglePoint(0,2)
       self.assertTrue(board.hasVerticalBingo())
    
    def test_VerticalMiddleBingo(self):
       board = Board(3,3)
       board.togglePoint(1,0)
       board.togglePoint(1,1)
       board.togglePoint(1,2)
       self.assertTrue(board.hasVerticalBingo())
    
    def test_VerticalRightBingo(self):
       board = Board(3,3)
       board.togglePoint(2,0)
       board.togglePoint(2,1)
       board.togglePoint(2,2)
       self.assertTrue(board.hasVerticalBingo())