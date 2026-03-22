<template>
  <div>
    <!-- 顶部账本信息 -->
    <div class="card">
      <div class="flex-between">
        <h2>{{ currentAccount.name }}</h2>
        <select v-model="currentAccountId" @change="switchAccount">
          <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
            {{ acc.name }}
          </option>
        </select>
      </div>
      <div style="margin-top: 8px;">
        <div style="font-size: 14px; color: #64748b;">本月支出</div>
        <div style="font-size: 28px; font-weight: 700;">¥{{ monthlyExpense }}</div>
      </div>
      <div style="display: flex; gap: 24px; margin-top: 12px;">
        <div>
          <span style="color: #64748b; font-size: 14px;">本月收入</span>
          <span style="margin-left: 8px; font-weight: 500;">¥{{ monthlyIncome }}</span>
        </div>
        <div>
          <span style="color: #64748b; font-size: 14px;">当前余额</span>
          <span style="margin-left: 8px; font-weight: 500;">¥{{ currentAccount.balance }}</span>
        </div>
      </div>
    </div>

    <!-- 消费汇总条 -->
    <div class="card" style="padding: 12px 16px;">
      <div class="flex-between">
        <span>本周消费 <strong>¥{{ weeklyExpense }}</strong></span>
        <span>本月消费 <strong>¥{{ monthlyExpense }}</strong></span>
      </div>
    </div>

    <!-- 图标网格组件 -->
    <IconGrid 
      :icons="icons" 
      :selected-icons="selectedIcons"
      @icon-click="toggleSelectIcon"
      @amount-click="recordExpense"
      @express-quick="handleExpress"
    />

    <!-- 交易列表组件 -->
    <TransactionList :transactions="filteredTransactions" />
  </div>
</template>-->

<script setup>
import { ref, computed, onMounted } from 'vue'
import IconGrid from '../components/IconGrid.vue'
import TransactionList from '../components/TransactionList.vue'
import { mockIcons, mockAccounts, mockTransactions } from '../mock'

// 状态
const accounts = ref(mockAccounts)
const currentAccountId = ref(mockAccounts.find(a => a.primary)?.id || 1)
const currentAccount = computed(() => accounts.value.find(a => a.id === currentAccountId.value) || accounts.value[0])
const icons = ref(mockIcons)
const selectedIcons = ref([]) // 存放选中图标的 id
const transactions = ref(mockTransactions)

// 过滤当前账本的交易
const filteredTransactions = computed(() => {
  return transactions.value.filter(t => t.accountId === currentAccountId.value)
})

// 计算月支出（模拟）
const monthlyExpense = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return transactions.value
    .filter(t => t.date.startsWith(`${year}-${month}`) && t.accountId === currentAccountId.value)
    .reduce((sum, t) => sum + t.total, 0)
})

const monthlyIncome = computed(() => 0) // 暂不实现收入
const weeklyExpense = computed(() => {
  // 简单模拟：取最近7天
  const today = new Date()
  const weekAgo = new Date(today.setDate(today.getDate() - 7)).toISOString().slice(0,10)
  return transactions.value
    .filter(t => t.date >= weekAgo && t.accountId === currentAccountId.value)
    .reduce((sum, t) => sum + t.total, 0)
})

// 切换账本
function switchAccount() {
  // 账本切换时清除选中图标
  selectedIcons.value = []
}

// 图标点击：高亮/取消高亮
function toggleSelectIcon(iconId) {
  const index = selectedIcons.value.indexOf(iconId)
  if (index === -1) {
    selectedIcons.value.push(iconId)
  } else {
    selectedIcons.value.splice(index, 1)
  }
}

// 点击金额：记录支出
function recordExpense(iconId) {
  // 如果有选中图标，则累计所有选中图标的金额（包含当前点击的这个图标）
  let targetIcons = []
  if (selectedIcons.value.length > 0) {
    // 如果当前点击的图标不在选中列表中，先加入（但通常点击金额时图标应该已选中，这里兼容处理）
    if (!selectedIcons.value.includes(iconId)) {
      selectedIcons.value.push(iconId)
    }
    targetIcons = icons.value.filter(i => selectedIcons.value.includes(i.id))
  } else {
    // 无选中，只记当前图标
    targetIcons = icons.value.filter(i => i.id === iconId)
  }

  const totalAmount = targetIcons.reduce((sum, i) => sum + i.defaultAmount, 0)
  const itemNames = targetIcons.map(i => i.name).join('、')

  // 创建新交易记录
  const newTransaction = {
    id: Date.now(),
    date: new Date().toISOString().slice(0,10),
    items: targetIcons.map(i => i.name),
    total: totalAmount,
    accountId: currentAccountId.value,
    mealType: guessMealType()
  }

  transactions.value.unshift(newTransaction)

  // 更新账本余额
  const account = accounts.value.find(a => a.id === currentAccountId.value)
  if (account) {
    account.balance -= totalAmount
  }

  // 清除选中状态
  selectedIcons.value = []
}

// 快递快捷记账
function handleExpress(amount) {
  const expressIcon = icons.value.find(i => i.type === 'express')
  if (!expressIcon) return
  const newTransaction = {
    id: Date.now(),
    date: new Date().toISOString().slice(0,10),
    items: ['快递'],
    total: amount,
    accountId: currentAccountId.value,
    mealType: '其他'
  }
  transactions.value.unshift(newTransaction)
  const account = accounts.value.find(a => a.id === currentAccountId.value)
  if (account) account.balance -= amount
}

// 根据时间判断餐别（简单模拟）
function guessMealType() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 9) return '早餐'
  if (hour >= 11 && hour < 14) return '午餐'
  if (hour >= 17 && hour < 20) return '晚餐'
  if (hour >= 21 || hour < 3) return '夜宵'
  return '其他'
}
</script>


<!-- <template>
  <div style="padding: 20px;">
    <h1>首页 - 记账应用</h1>
    <p>如果你能看到这个页面，说明路由配置成功。</p>
  </div>
</template> -->