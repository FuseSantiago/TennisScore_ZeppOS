const TENNIS_POINTS = ['0', '15', '30', '40']
const PLAYER_A = 'N'
const PLAYER_B = 'E'

const VIBRATE_SCENE_LIGHT = 23
const VIBRATE_SCENE_RESET = 0
const VIBRATE_SCENE_LONG_500 = 5
const GAME_WON_VIBRATION_MS = 500

let vibrateSensor = null

function getVibrateSensor() {
  if (vibrateSensor) {
    return vibrateSensor
  }
  try {
    if (typeof hmSensor !== 'undefined' && hmSensor.createSensor && hmSensor.id && hmSensor.id.VIBRATE !== undefined) {
      vibrateSensor = hmSensor.createSensor(hmSensor.id.VIBRATE)
    }
  } catch (e) {
    vibrateSensor = null
  }
  return vibrateSensor
}

function createInitialScore() {
  return {
    gamesA: 0,
    gamesB: 0,
    pointsA: 0,
    pointsB: 0,
    advA: false,
    advB: false
  }
}

Page({
  onDestroy() {
    try {
      if (vibrateSensor) {
        vibrateSensor.stop()
      }
    } catch (e) {}
  },

  build() {
    function hapticButton() {
      const v = getVibrateSensor()
      if (!v) {
        return
      }
      try {
        v.stop()
        v.scene = VIBRATE_SCENE_LIGHT
        v.start()
      } catch (e) {}
    }

    function hapticButtonReset() {
      const v = getVibrateSensor()
      if (!v) {
        return
      }
      try {
        v.stop()
        v.scene = VIBRATE_SCENE_RESET
        v.start()
      } catch (e) {}
    }

    function hapticGameWon() {
      const v = getVibrateSensor()
      if (!v) {
        return
      }
      try {
        v.stop()
        v.scene = VIBRATE_SCENE_LONG_500
        v.start()
        if (typeof setTimeout === 'function') {
          setTimeout(() => {
            try {
              v.stop()
            } catch (e2) {}
          }, GAME_WON_VIBRATION_MS)
        }
      } catch (e) {}
    }

    const deviceInfo = hmSetting.getDeviceInfo()
    const width = deviceInfo.width
    const headerHeight = 36
    const rowHeight = 60
    const buttonWidth = 80
    const padding = 8

    let score = createInitialScore()

    const playerAWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 54,
      w: width,
      h: rowHeight,
      color: 0xffffff,
      text_size: 36,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: ''
    })

    const playerBWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 108,
      w: width,
      h: rowHeight,
      color: 0xffffff,
      text_size: 36,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: ''
    })

    function pointText(points, hasAdvantage) {
      if (hasAdvantage) {
        return 'AD'
      }
      return TENNIS_POINTS[points]
    }

    function refreshScoreUI() {
      playerAWidget.setProperty(hmUI.prop.MORE, {
        text: `${PLAYER_A}  G:${score.gamesA}  P:${pointText(score.pointsA, score.advA)}`
      })
      playerBWidget.setProperty(hmUI.prop.MORE, {
        text: `${PLAYER_B}  G:${score.gamesB}  P:${pointText(score.pointsB, score.advB)}`
      })
    }

    function resetPointsOnly() {
      score.pointsA = 0
      score.pointsB = 0
      score.advA = false
      score.advB = false
    }

    function addPointToA() {
      if (score.advA) {
        score.gamesA += 1
        resetPointsOnly()
        hapticGameWon()
      } else if (score.advB) {
        score.advB = false
      } else if (score.pointsA < 3) {
        score.pointsA += 1
      } else if (score.pointsB < 3) {
        score.gamesA += 1
        resetPointsOnly()
        hapticGameWon()
      } else {
        score.advA = true
      }
      refreshScoreUI()
    }

    function addPointToB() {
      if (score.advB) {
        score.gamesB += 1
        resetPointsOnly()
        hapticGameWon()
      } else if (score.advA) {
        score.advA = false
      } else if (score.pointsB < 3) {
        score.pointsB += 1
      } else if (score.pointsA < 3) {
        score.gamesB += 1
        resetPointsOnly()
        hapticGameWon()
      } else {
        score.advB = true
      }
      refreshScoreUI()
    }

    function removePointFromA() {
      if (score.advA) {
        score.advA = false
      } else if (score.advB) {
        score.advB = false
      } else if (score.pointsA > 0) {
        score.pointsA -= 1
      } else if (score.gamesA > 0) {
        score.gamesA -= 1
        score.pointsA = 3
        score.pointsB = 0
        score.advA = false
        score.advB = false
      }
      refreshScoreUI()
    }

    function removePointFromB() {
      if (score.advB) {
        score.advB = false
      } else if (score.advA) {
        score.advA = false
      } else if (score.pointsB > 0) {
        score.pointsB -= 1
      } else if (score.gamesB > 0) {
        score.gamesB -= 1
        score.pointsA = 0
        score.pointsB = 3
        score.advA = false
        score.advB = false
      }
      refreshScoreUI()
    }

    function createScoreTouchButton(x, y, label, onShortPress, onLongPress) {
      const normalColor = 0x2b80ff
      const pressColor = 0x1f5fbf
      const LONG_MS = 1000

      const bgWidget = hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x,
        y,
        w: buttonWidth,
        h: rowHeight,
        radius: 12,
        color: normalColor
      })

      const touchLayer = hmUI.createWidget(hmUI.widget.TEXT, {
        x,
        y,
        w: buttonWidth,
        h: rowHeight,
        color: 0xffffff,
        text_size: 28,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text: label
      })

      let pressStart = 0
      let pollTimer = null
      let longPressFired = false

      function stopPoll() {
        if (pollTimer != null && typeof clearInterval === 'function') {
          clearInterval(pollTimer)
        }
        pollTimer = null
      }

      touchLayer.addEventListener(hmUI.event.CLICK_DOWN, () => {
        hapticButton()
        stopPoll()
        longPressFired = false
        pressStart = Date.now()
        bgWidget.setProperty(hmUI.prop.COLOR, pressColor)

        if (typeof setInterval === 'function') {
          pollTimer = setInterval(() => {
            if (longPressFired || pressStart <= 0) {
              return
            }
            if (Date.now() - pressStart >= LONG_MS) {
              longPressFired = true
              stopPoll()
              onLongPress()
            }
          }, 50)
        }
      })

      touchLayer.addEventListener(hmUI.event.CLICK_UP, () => {
        bgWidget.setProperty(hmUI.prop.COLOR, normalColor)
        stopPoll()

        const elapsed = pressStart > 0 ? Date.now() - pressStart : 0
        pressStart = 0

        if (longPressFired) {
          longPressFired = false
          return
        }

        if (elapsed >= LONG_MS) {
          onLongPress()
          return
        }

        onShortPress()
      })
    }

    createScoreTouchButton(padding, 200, '+ N', addPointToA, removePointFromA)
    createScoreTouchButton(width - buttonWidth - padding, 200, '+ E', addPointToB, removePointFromB)

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: padding,
      y: 300,
      w: width - padding * 2,
      h: 56,
      radius: 12,
      normal_color: 0x5f5f5f,
      press_color: 0x3f3f3f,
      text: 'Reiniciar',
      click_func: () => {
        hapticButtonReset()
        score = createInitialScore()
        refreshScoreUI()
      }
    })

    refreshScoreUI()
  }
})
