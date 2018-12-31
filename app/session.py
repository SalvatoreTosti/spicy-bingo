class Session():
    def __init__(self, name):
        self._name = name
        self._players = []
    
    @property
    def name(self):
        return self._name
    
    @property
    def players(self):
        return self._players
    
    def addPlayer(self, name):
        self._players.append(name)
        
    