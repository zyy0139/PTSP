<template>
  <canvas ref="canvas" width="80" height="30" />
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps, watch } from 'vue'
import { throttle } from '@/utils/debounceThrottle'

const emits = defineEmits(['getCaptcha'])
const props = defineProps({
  noMatchCode: {
    type: Boolean,
    default: false
  }
})
const canvas = ref(null)

const updateCaptcha = new Event('updateCaptcha')

onMounted(() => {
  canvas.value.addEventListener('click', throttle(() => canvas.value.dispatchEvent(updateCaptcha), 500))
  handleGetCaptcha(canvas.value, 4)

  watch(
      () => props.noMatchCode,
      () => {
        canvas.value.dispatchEvent(updateCaptcha)
      }
  )
})

function handleGetCaptcha(canvasElement, codeCount) {
  const ctx = canvasElement.getContext('2d')
  ctx.save()
  canvasElement.addEventListener('updateCaptcha', () => getCaptcha(ctx, codeCount))
  getCaptcha(ctx, codeCount)
}

function getCaptcha(ctx, codeCount) {
  ctx.restore()
  ctx.restore()
  ctx.clearRect(0, 0, 80, 30)
  ctx.save()
  let result = ''
  // 设置字体样式
  ctx.font = 'bold 15px serif'
  // 设置文字基线
  ctx.textBaseline = 'top'
  // 设置初始落点
  ctx.translate(10, 5)
  // 保存初始设置
  ctx.save()

  let i = 0
  while (i < codeCount) {
    const code = getRandomInt(9, 0)
    result = result + '' + code

    ctx.restore()
    ctx.save()
    ctx.fillStyle = getRandomRGB()
    ctx.translate((i) * getRandomInt(20, 15), 0)
    ctx.rotate(getRandomAngle(40) * Math.PI / 180)
    ctx.fillText(code, 0, 0)

    i++
  }
  emits('getCaptcha', result)
}

function getRandomInt(max = 1, min = 0) {
  return Math.floor(Math.random() * (max - min)) + min
}

function getRandomRGB() {
  return `rgb(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)})`
}

function getRandomAngle(maxAbsolute, isMinus = 0) {
  if (isMinus === 0) {
    if (Math.random() >= 0.5) {
      return getRandomAngle(maxAbsolute, 1)
    } else {
      return getRandomAngle(maxAbsolute, -1)
    }
  } else if (isMinus < 0) {
    return -getRandomInt(maxAbsolute)
  } else {
    return getRandomInt(maxAbsolute)
  }
}
</script>

<style scoped>

</style>