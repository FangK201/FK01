<template>
  <div class="card">
    <h2>近期记账</h2>
    <div v-if="groupedTransactions.length === 0" style="text-align: center; color: #94a3b8; padding: 20px;">
      暂无记录
    </div>
    <div v-for="group in groupedTransactions" :key="group.date" style="margin-bottom: 16px;">
      <div style="font-weight: 600; margin-bottom: 8px;">{{ group.date }}</div>
      <div 
        v-for="tx in group.items" 
        :key="tx.id"
        style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9;"
      >
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="background: #eef2ff; padding: 4px 8px; border-radius: 40px; font-size: 12px;">{{ tx.mealType }}</span>
          <span>{{ tx.items.join('、') }}</span>
        </div>
        <span style="font-weight: 500;">-¥{{ tx.total }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  transactions: Array
})

const groupedTransactions = computed(() => {
  const groups = {}
  props.transactions.forEach(tx => {
    if (!groups[tx.date]) groups[tx.date] = []
    groups[tx.date].push(tx)
  })
  return Object.keys(groups).sort((a,b) => b.localeCompare(a)).map(date => ({
    date,
    items: groups[date]
  }))
})
</script>