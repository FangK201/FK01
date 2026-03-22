<template>
  <div class="card">
    <h2>快捷记账</h2>
    <div class="icon-grid">
      <div v-for="icon in icons" :key="icon.id" class="icon-item-wrapper">
        <div 
          class="icon-item"
          :class="{ selected: selectedIcons.includes(icon.id) }"
          @click="$emit('icon-click', icon.id)"
        >
          <span class="icon-emoji">{{ icon.icon }}</span>
          <span class="icon-name">{{ icon.name }}</span>
        </div>
        <div 
          class="amount-btn"
          @click="$emit('amount-click', icon.id)"
        >
          ¥{{ icon.defaultAmount }}
        </div>
      </div>
    </div>

    <!-- 快递快捷区域 -->
    <div class="express-section">
      <div class="flex-between">
        <span class="express-label">快递</span>
        <div class="express-buttons">
          <button class="btn-outline" @click="startVoiceExpress">语音</button>
          <button class="btn" @click="showExpressModal = true">快速</button>
        </div>
      </div>
    </div>

    <!-- 快递金额选择模态框 -->
    <div v-if="showExpressModal" class="modal-overlay" @click.self="showExpressModal = false">
      <div class="modal">
        <h3>选择快递金额</h3>
        <div class="amount-options">
          <button v-for="amt in [8,10,12,15,18,20]" :key="amt" @click="selectExpressAmount(amt)">
            ¥{{ amt }}
          </button>
        </div>
        <button class="btn" style="width:100%; margin-top:16px;" @click="showExpressModal = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  icons: Array,
  selectedIcons: Array
})

const emit = defineEmits(['icon-click', 'amount-click', 'express-quick'])
const showExpressModal = ref(false)

function selectExpressAmount(amount) {
  showExpressModal.value = false
  emit('express-quick', amount)
}

function startVoiceExpress() {
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
    const match = transcript.match(/快递\s*(\d+(?:\.\d+)?)\s*元?/)
    if (match) {
      const amount = parseFloat(match[1])
      if (!isNaN(amount) && amount > 0) {
        emit('express-quick', amount)
      } else {
        alert('请说出金额，如“快递15元”')
      }
    } else {
      alert('请说出“快递+金额+元”，如“快递15元”')
    }
  }

  recognition.onerror = () => {
    alert('语音识别失败，请检查麦克风权限')
  }

  recognition.start()
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1px solid #eef2f6;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 12px;
}
.icon-item-wrapper {
  text-align: center;
}
.icon-item {
  background: #f8fafc;
  border-radius: 16px;
  padding: 12px 4px 8px;
  cursor: pointer;
  transition: all 0.1s;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.icon-item.selected {
  border-color: #2563eb;
  background: #eef2ff;
}
.icon-emoji {
  font-size: 32px;
}
.icon-name {
  font-size: 12px;
  color: #64748b;
}
.amount-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  padding: 4px 0;
  font-size: 13px;
  font-weight: 500;
  margin-top: 6px;
  cursor: pointer;
}
.amount-btn:hover {
  background: #f1f5f9;
}
.express-section {
  margin-top: 20px;
  border-top: 1px solid #eef2f6;
  padding-top: 16px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.express-label {
  font-weight: 500;
}
.express-buttons {
  display: flex;
  gap: 8px;
}
.btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 40px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}
.btn-outline {
  background: white;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  padding: 8px 16px;
  border-radius: 40px;
  cursor: pointer;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: white;
  border-radius: 24px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
}
.amount-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 16px 0;
}
.amount-options button {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 40px;
  padding: 8px;
  cursor: pointer;
}
</style>