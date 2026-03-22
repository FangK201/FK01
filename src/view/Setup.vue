 <template>
  <div v-if="step === 1">
    <input type="file" accept="image/*" @change="onImageUpload" />
    <div v-if="recognizing">识别中...</div>
    <!-- 显示识别结果，允许用户手动修正 -->
  </div>
</template>

<script setup>
import Tesseract from 'tesseract.js'

const recognizing = ref(false)
const tempIcons = ref([])

async function onImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  recognizing.value = true
  try {
    const { data: { text } } = await Tesseract.recognize(file, 'chi_sim')
    // 解析文本，生成 { name, defaultAmount } 数组
    const lines = text.split('\n')
    const items = []
    lines.forEach(line => {
      const match = line.match(/([\u4e00-\u9fa5]+)\s*(\d+(?:\.\d+)?)/)
      if (match) {
        items.push({ name: match[1], defaultAmount: parseFloat(match[2]), icon: '🍽️' })
      }
    })
    tempIcons.value = items
  } catch (err) {
    alert('识别失败，请手动输入')
  } finally {
    recognizing.value = false
  }
}
</script>
<!-- <template>
  <div class="setup-container">
    <div v-if="step === 1">
      <h2>📸 拍照导入菜单</h2>
      <input type="file" accept="image/*" @change="onImageUpload" />
      <div v-if="tempIcons.length">
        <h3>识别结果</h3>
        <div v-for="(icon, idx) in tempIcons" :key="idx">
          {{ icon.name }} ¥{{ icon.defaultAmount }}
          <button @click="removeIcon(idx)">删除</button>
        </div>
        <button @click="addToIcons">添加到图标库</button>
      </div>
      <div class="actions">
        <button @click="step = 2">跳过，手动添加</button>
        <button @click="step = 2">下一步</button>
      </div>
    </div>

    <div v-if="step === 2">
      <h2>✏️ 管理图标</h2>
      <div v-for="(icon, idx) in icons" :key="idx">
        <input v-model="icon.name" placeholder="名称" />
        <input v-model.number="icon.defaultAmount" placeholder="金额" />
        <button @click="deleteIcon(idx)">删除</button>
      </div>
      <button @click="addEmptyIcon">+ 添加图标</button>
      <div class="actions">
        <button @click="step = 1">上一步</button>
        <button @click="step = 3">下一步</button>
      </div>
    </div>

    <div v-if="step === 3">
      <h2>💰 设置初始余额</h2>
      <div v-for="acc in accounts" :key="acc.id">
        <label>{{ acc.name }}</label>
        <input v-model.number="acc.balance" type="number" />
      </div>
      <div class="actions">
        <button @click="step = 2">上一步</button>
        <button @click="finishSetup">完成并保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storage } from '../utils/storage'
import Tesseract from 'tesseract.js'

const router = useRouter()
const step = ref(1)
const tempIcons = ref([])      // 识别出的临时图标
const icons = ref([])          // 最终图标列表
const accounts = ref([
  { id: 'bank', name: '银行卡', balance: 0, type: 'bank', primary: true },
  { id: 'wechat', name: '微信支付', balance: 0, type: 'wechat', primary: false }
])

// 图像识别（复用之前代码）
async function onImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  const { data: { text } } = await Tesseract.recognize(file, 'chi_sim')
  // 解析逻辑...
  // 将结果填充到 tempIcons
}

function addToIcons() {
  icons.value.push(...tempIcons.value)
  tempIcons.value = []
}

function addEmptyIcon() {
  icons.value.push({ id: Date.now(), name: '新菜品', defaultAmount: 0, icon: '🍽️' })
}

function deleteIcon(idx) {
  icons.value.splice(idx, 1)
}

function finishSetup() {
  // 保存图标和账本
  storage.set('icons', icons.value)
  storage.set('accounts', accounts.value)
  storage.set('hasSetup', true)
  router.push('/')
}
</script> -->