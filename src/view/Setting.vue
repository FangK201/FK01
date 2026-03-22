<template>
  <button class="btn" @click="showAddIconModal = true">+ 拍照添加图标</button>
<AddIconModal v-if="showAddIconModal" @close="showAddIconModal = false" @added="refreshIcons" />
  <div>
    <h2>设置</h2>

    <div class="card">
      <h3>图标管理</h3>
      <div v-for="icon in icons" :key="icon.id" class="flex-between" style="padding: 8px 0;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 24px;">{{ icon.icon }}</span>
          <span>{{ icon.name }} (¥{{ icon.defaultAmount }})</span>
        </div>
        <button class="btn-outline btn" style="padding: 4px 12px;">编辑</button>
      </div>
      <button class="btn" style="width:100%; margin-top:12px;">+ 新增图标</button>
    </div>

    <div class="card">
      <h3>账本管理</h3>
      <div v-for="acc in accounts" :key="acc.id" class="flex-between" style="padding: 8px 0;">
        <span>{{ acc.name }} ({{ acc.primary ? '主' : '副' }})</span>
        <button class="btn-outline btn" style="padding: 4px 12px;">编辑</button>
      </div>
      <button class="btn" style="width:100%; margin-top:12px;">+ 添加账本</button>
    </div>

    <div class="card">
      <h3>餐别时段</h3>
      <div>早餐 05:00-09:00</div>
      <div>午餐 11:00-14:00</div>
      <div>晚餐 17:00-20:00</div>
      <div>夜宵 21:00-03:00</div>
      <button class="btn-outline btn" style="margin-top:12px;">自定义</button>
    </div>

    <div class="card">
      <h3>数据导出</h3>
      <button class="btn" style="width:100%;">导出Excel</button>
      <p style="font-size:12px; color:#94a3b8; margin-top:8px;">包含日期、三餐金额、快递、支付方式</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mockIcons, mockAccounts } from '../mock'

const icons = ref(mockIcons)
const accounts = ref(mockAccounts)
function resetSetup() {
  storage.remove('hasSetup')
  router.push('/setup')
}

</script>
