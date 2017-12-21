var player = require('play-sound')(opts = {})

// $ mplayer foo.mp3 
player.play('foo.mp3', function (err) {
    if (err) throw err
})
