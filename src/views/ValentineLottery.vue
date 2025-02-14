<template>
  <div class="valentine-lottery">
    <div class="lottery-container">
      <h1 class="title">💝 情人节礼物抽奖 💝</h1>
      
      <div class="gift-display" :class="{ 'animate': isAnimating }">
        <div class="gift-box">
          <i class="gift-icon">🎁</i>
          <p class="gift-name">{{ currentGift?.name || '点击抽奖' }}</p>
          <p class="gift-desc" v-if="currentGift && !isAnimating">{{ currentGift.desc }}</p>
        </div>
      </div>

      <button 
        class="lottery-btn" 
        @click="startLottery"
        :disabled="isAnimating"
      >
        开始抽奖
      </button>
    </div>
    
    <!-- 新的烟花容器 -->
    <canvas id="fireworks" class="fireworks-canvas"></canvas>

    <!-- 添加爱的标语 -->
    <div class="love-signature">
      <div class="hearts">
        <span>❤️</span>
        <span>💝</span>
        <span>❤️</span>
      </div>
      <p class="signature-text">Ambi 爱 木曦 每一天</p>
    </div>

    <!-- 添加音频元素 -->
    <audio id="fireworksSound" preload="auto" loop>
      <source src="/sounds/fireworks.wav" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Fireworks } from 'fireworks-js'

// 修改礼物列表加载方式
const giftList = ref([])

const currentGift = ref(null)
const isAnimating = ref(false)

// 加载礼物列表
const loadGifts = async () => {
  try {
    const response = await fetch('/data/gifts.json')
    const data = await response.json()
    giftList.value = data.gifts
  } catch (error) {
    console.error('加载礼物列表失败:', error)
    // 设置默认礼物列表以防加载失败
    giftList.value = [
      {
        name: "浪漫烛光晚餐",
        desc: "与你共享温馨时光，让烛光见证我们的爱情"
      },
      // ... 可以添加更多默认礼物
    ]
  }
}

let fireworksInstance = null
let fireworksSound = null

onMounted(async () => {
  // 加载礼物列表
  await loadGifts()

  // 初始化音频
  fireworksSound = document.getElementById('fireworksSound')
  fireworksSound.volume = 0.5  // 设置音量为50%
  
  // 初始化烟花
  const container = document.getElementById('fireworks')
  fireworksInstance = new Fireworks(container, {
    autoresize: true,
    opacity: 0.5,
    acceleration: 1.05,
    friction: 0.97,
    gravity: 1.5,
    particles: 50,
    traceLength: 3,
    traceSpeed: 10,
    explosion: 5,
    intensity: 30,
    flickering: 50,
    lineStyle: 'round',
    hue: {
      min: 300,  // 粉色系
      max: 360
    },
    delay: {
      min: 30,
      max: 60
    },
    rocketsPoint: {
      min: 50,
      max: 50
    },
    lineWidth: {
      explosion: {
        min: 1,
        max: 3
      },
      trace: {
        min: 1,
        max: 2
      }
    },
    brightness: {
      min: 50,
      max: 80
    },
    decay: {
      min: 0.015,
      max: 0.03
    },
    mouse: {
      click: false,
      move: false,
      max: 1
    }
  })
})

onUnmounted(() => {
  if (fireworksInstance) {
    fireworksInstance.stop()
    fireworksInstance = null
  }
  // 停止并清理音频
  if (fireworksSound) {
    fireworksSound.pause()
    fireworksSound.currentTime = 0
  }
})

const startLottery = () => {
  isAnimating.value = true
  
  let times = 0
  const maxTimes = 20
  const interval = setInterval(() => {
    currentGift.value = giftList.value[Math.floor(Math.random() * giftList.value.length)]
    times++
    
    if (times >= maxTimes) {
      clearInterval(interval)
      isAnimating.value = false
      
      if (fireworksInstance) {
        fireworksInstance.start()
        // 播放烟花音效
        if (fireworksSound) {
          fireworksSound.currentTime = 0  // 重置音频播放位置
          fireworksSound.play().catch(e => console.log('音频播放失败:', e))
        }
        
        setTimeout(() => {
          fireworksInstance.stop()
          // 停止音效
          if (fireworksSound) {
            fireworksSound.pause()
            fireworksSound.currentTime = 0
          }
        }, 60000)  // 改为 60000 毫秒
      }
    }
  }, 100)
}
</script>

<style scoped>
.valentine-lottery {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 修改背景渐变色，使用更柔和的粉色 */
  background: linear-gradient(135deg, 
    rgba(255, 182, 193, 0.8),    /* 浅粉红 */
    rgba(255, 105, 180, 0.7)     /* 较淡的亮粉红 */
  );
  padding: 20px;
}

/* 调整卡片透明度，使其与背景更协调 */
.lottery-container {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
}

.title {
  color: #ff1493;
  margin-bottom: 40px;
  font-size: 2rem;
}

.gift-display {
  margin: 30px 0;
  padding: 20px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 5px 15px rgba(255, 20, 147, 0.2);
}

.gift-box {
  transition: transform 0.3s;
}

.animate .gift-box {
  animation: shake 0.5s infinite;
}

.gift-icon {
  font-size: 4rem;
  margin-bottom: 10px;
  display: block;
}

.gift-name {
  font-size: 1.5rem;
  color: #ff1493;
  margin: 10px 0;
  min-height: 40px;
  transition: all 0.3s;
  animation: giftAppear 0.5s ease-out when-gift-shows;
}

.lottery-btn {
  background: #ff1493;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
}

.lottery-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 20, 147, 0.4);
}

.lottery-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.gift-desc {
  font-size: 1rem;
  color: #666;
  margin-top: 10px;
  font-style: italic;
  line-height: 1.4;
}

/* 新增烟花画布样式 */
.fireworks-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 99;
}

/* 移除旧的烟花样式 */
.fireworks, .firework-container, .firework-spark {
  display: none;
}

/* 添加标语样式 */
.love-signature {
  position: fixed;
  bottom: 30px;
  left: 0;
  right: 0;
  text-align: center;
  animation: fadeInUp 1.5s ease-out;
  z-index: 100;
}

.hearts {
  margin-bottom: 10px;
}

.hearts span {
  font-size: 1.5rem;
  margin: 0 5px;
  display: inline-block;
  animation: heartBeat 1.5s infinite;
  filter: drop-shadow(0 0 5px rgba(255, 20, 147, 0.5));
}

.hearts span:nth-child(2) {
  animation-delay: 0.5s;
  font-size: 1.7rem;
}

.hearts span:nth-child(3) {
  animation-delay: 1s;
}

.signature-text {
  color: white;
  font-size: 1.2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: bold;
  letter-spacing: 2px;
  transform: translateY(0);
  animation: floatText 3s ease-in-out infinite;
}

@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(40px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@keyframes floatText {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
  100% { transform: scale(1); }
}
</style> 