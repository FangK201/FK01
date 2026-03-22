<template>
  <div>
    <h2>总览</h2>

    <!-- 年度总余额卡片 -->
    <div class="card">
      <div class="flex-between" @click="expanded = !expanded" style="cursor: pointer;">
        <span style="font-weight: 600;">年度总余额</span>
        <span>¥{{ totalBalance }} <span style="color: #94a3b8;">{{ expanded ? '▲' : '▼' }}</span></span>
      </div>
      <div v-if="expanded" style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
        <div v-for="acc in accounts" :key="acc.id" class="flex-between">
          <span>{{ acc.name }}</span>
          <span style="font-weight: 500;">¥{{ acc.balance }}</span>
        </div>
      </div>
    </div>

    <!-- 各账本卡片 -->
    <div v-for="acc in accounts" :key="acc.id" class="card" style="cursor: pointer;" @click="goToAccount(acc.id)">
      <div class="flex-between">
        <div>
          <div style="font-weight: 600;">{{ acc.name }}</div>
          <div style="font-size: 12px; color: #64748b;">余额 ¥{{ acc.balance }}</div>
        </div>
        <span>📊</span>
      </div>
    </div>

    <!-- 内部转账按钮 -->
    <button class="btn" style="width:100%; margin-top: 16px;" @click="showTransfer = true">内部转账</button>

    <!-- 转账模态框 -->
    <div v-if="showTransfer" class="modal-overlay" @click.self="showTransfer = false">
      <div class="modal">
        <h3 style="margin-bottom: 20px;">内部转账</h3>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <select v-model="transferFrom">
            <option v-for="acc in accounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
          </select>
          <select v-model="transferTo">
            <option v-for="acc in accounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
          </select>
          <input type="number" v-model.number="transferAmount" placeholder="金额" />
          <div class="flex-between">
            <button class="btn btn-outline" @click="showTransfer = false">取消</button>
            <button class="btn" @click="doTransfer">确认转账</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockAccounts } from '../mock'

const router = useRouter()
const accounts = ref(mockAccounts)
const expanded = ref(false)
const showTransfer = ref(false)
const transferFrom = ref(accounts.value[0]?.id)
const transferTo = ref(accounts.value[1]?.id)
const transferAmount = ref(0)

const totalBalance = computed(() => {
  return accounts.value.reduce((sum, acc) => sum + acc.balance, 0)
})

function goToAccount(id) {
  // 切换到对应账本首页（需要先设置当前账本，这里简化：直接跳转首页并提示）
  alert(`跳转到账本 ${id} 的首页（实际应切换当前账本）`)
  router.push('/')
}

function doTransfer() {
  if (transferFrom.value === transferTo.value) {
    alert('不能转到同一账本')
    return
  }
  if (transferAmount.value <= 0) {
    alert('金额必须大于0')
    return
  }
  const fromAcc = accounts.value.find(a => a.id === transferFrom.value)
  const toAcc = accounts.value.find(a => a.id === transferTo.value)
  if (fromAcc.balance < transferAmount.value) {
    alert('余额不足')
    return
  }
  fromAcc.balance -= transferAmount.value
  toAcc.balance += transferAmount.value

  // 添加转账记录（这里省略，实际应添加到交易列表）

  alert('转账成功')
  showTransfer.value = false
}
</script>