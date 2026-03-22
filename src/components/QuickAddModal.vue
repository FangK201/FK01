<!-- <template>
  <div class="modal">
    <!-- 现有表单 --
    <div class="form-group">
      <label>金额</label>
      <div style="display: flex; gap: 8px;">
        <input type="number" v-model.number="amount" placeholder="请输入金额" />
        <button @click="startVoice" class="voice-btn">🎤</button>
      </div>
    </div>
  </div>
</template>

<script setup>
function startVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('浏览器不支持语音识别')
    return
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.interimResults = false

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    // 解析 “快递15元” 或 “外卖20元”
    const match = transcript.match(/([\u4e00-\u9fa5]+)(\d+(?:\.\d+)?)元/)
    if (match) {
      category.value = match[1]
      amount.value = parseFloat(match[2])
    } else {
      alert('识别内容无法解析，请说“类别金额元”，如“外卖20元”')
    }
  }
  recognition.start()
}
</script> -->

<template>
  <button @click="startVoice">🎤 语音记账</button>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['voiceResult'])

function startVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('浏览器不支持语音识别')
    return
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    // 简单解析：期望格式如“快递15元”或“外卖20元”
    const match = transcript.match(/([\u4e00-\u9fa5]+)(\d+(?:\.\d+)?)元/)
    if (match) {
      const category = match[1]
      const amount = parseFloat(match[2])
      emit('voiceResult', { category, amount })
    } else {
      alert('识别内容无法解析，请重新说（如“快递15元”）')
    }
  }

  recognition.onerror = (event) => {
    console.error('语音识别错误', event.error)
    alert('语音识别失败，请检查麦克风权限')
  }

  recognition.start()
}
</script>