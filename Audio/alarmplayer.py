from playsound import playsound

class Player:

    def __init__(self):
        pass

    def play_menace(self):
        playsound('./menace_detectee.wav')

    def play_base_maj(self):
        playsound('./base_maj.wav')

    def play_scan_terminee(self):
        playsound('./scan_termine.wav')


if __name__ == '__main__':

    player = Player()

    player.play_menace()
    player.play_base_maj()
    player.play_scan_terminee()
