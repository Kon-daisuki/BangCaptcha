<script setup>
import { ref, onMounted } from 'vue';

const API_BASE = 'https://band.kessoku.us.kg';

const challenge = ref(null);
const selectedIndexes = ref([]);
const message = ref('');
const isSuccess = ref(false);
const loading = ref(false);

// 行为分析数据
const traceData = ref([]);
const startTime = ref(0);

const fetchCaptcha = async () => {
  loading.value = true;
  message.value = '';
  isSuccess.value = false;
  selectedIndexes.value = [];
  traceData.value = []; // 重置轨迹
  
  try {
    const res = await fetch(`${API_BASE}/api/captcha`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    challenge.value = data;
    
    // 修复图片路径（如果 Worker 返回相对路径）
    if (challenge.value && challenge.value.images) {
      challenge.value.images = challenge.value.images.map(img => {
        return img.startsWith('http') ? img : `${API_BASE}${img}`;
      });
    }

    startTime.value = Date.now();
  } catch (error) {
    console.error('Failed to fetch captcha:', error);
    message.value = '加载验证码失败';
  } finally {
    loading.value = false;
  }
};

const handleMouseMove = (e) => {
  if (!challenge.value || isSuccess.value) return;
  if (traceData.value.length > 500) return;
  traceData.value.push([Date.now(), e.clientX, e.clientY]);
};

const toggleSelect = (index) => {
  if (selectedIndexes.value.includes(index)) {
    selectedIndexes.value = selectedIndexes.value.filter(i => i !== index);
  } else {
    selectedIndexes.value.push(index);
  }
};

const verifyCaptcha = async () => {
  if (!challenge.value) return;
  
  loading.value = true;
  try {
    const body = {
      id: challenge.value.id,
      selectedIndexes: selectedIndexes.value,
      traceData: traceData.value,
      startTime: startTime.value
    };

    // 这里我们先模拟发送给 Worker 验证，或者直接发送给父窗口
    // 既然我们在 iframe 里，最好的做法是：
    // 1. 如果 Worker 有 /api/verify 接口，先在这里验证一遍 UI 效果
    // 2. 验证成功后，再发消息给父窗口
    
    const res = await fetch(`${API_BASE}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await res.json();
    
    if (data.success) {
      isSuccess.value = true;
      const timeSec = data.duration ? (data.duration / 1000).toFixed(2) : '0';
      message.value = `验证通过! (耗时: ${timeSec}s)`;
      
      // 🔥 核心修改：告诉父窗口验证成功了，把 ID 和 索引 发过去
      // 父窗口随后会把这些数据再次发给 /api/register 进行最终校验
      setTimeout(() => {
         window.parent.postMessage({
            type: 'CAPTCHA_RESULT',
            payload: {
              captchaId: challenge.value.id,
              selectedIndexes: selectedIndexes.value
            }
         }, '*'); // 上线建议改为具体域名
      }, 500);

    } else {
      isSuccess.value = false;
      message.value = data.message || '验证失败';
      setTimeout(() => {
        if (!isSuccess.value) fetchCaptcha();
      }, 1500);
    }
  } catch (error) {
    console.error('Verification failed:', error);
    message.value = '验证请求出错';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCaptcha();
});
</script>

<template>
  <div class="captcha-container" @mousemove="handleMouseMove">
    <div v-if="loading && !challenge" class="loading">加载中...</div>
    
    <div v-else-if="challenge" class="captcha-box">
      <div class="header">
        <p>请点击所有的</p>
        <h2>{{ challenge.targetName }}</h2>
      </div>
      
      <div class="grid">
        <div 
          v-for="(img, index) in challenge.images" 
          :key="index"
          class="grid-item"
          @click="toggleSelect(index)"
        >
          <img :src="img" alt="captcha part" />
          <div v-if="selectedIndexes.includes(index)" class="overlay">
            <div class="checkmark">✓</div>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button @click="fetchCaptcha" class="refresh-btn">刷新</button>
        <button @click="verifyCaptcha" class="verify-btn" :disabled="loading || selectedIndexes.length === 0">
          {{ loading ? '验证中...' : '提交' }}
        </button>
      </div>

      <div v-if="message" :class="['message', isSuccess ? 'success' : 'error']">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<style>
/* 这里的样式直接放在全局，确保生效 */
body { margin: 0; padding: 0; background-color: transparent; }

.captcha-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 适配 iframe 高度 */
  min-height: 100vh; 
  background-color: transparent;
}

.captcha-box {
  background: #fff;
  border-radius: 8px;
  /* 阴影稍微调小一点，因为它在 iframe 里 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 16px;
  width: 320px; /* 固定宽度适合做插件 */
}

.header {
  background: #e91e63; /* 改成了波奇酱粉色风格，或者你可以改回 #4285f4 */
  color: white;
  padding: 16px;
  margin: -16px -16px 16px -16px;
  border-radius: 8px 8px 0 0;
  text-align: left;
}

.header p { margin: 0; font-size: 14px; }
.header h2 { margin: 4px 0 0 0; font-size: 20px; }

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-bottom: 16px;
}

.grid-item {
  position: relative;
  cursor: pointer;
  aspect-ratio: 1;
  overflow: hidden;
}

.grid-item img { width: 100%; height: 100%; object-fit: cover; display: block; }

.overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(233, 30, 99, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #e91e63;
  box-sizing: border-box;
}

.checkmark {
  background: #e91e63;
  color: white;
  border-radius: 50%;
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold;
  position: absolute; top: 4px; left: 4px; font-size: 14px;
}

.actions { display: flex; gap: 12px; }

button { border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background 0.2s; }

.refresh-btn { background: #f1f3f4; color: #555; }
.verify-btn { background: #e91e63; color: white; flex-grow: 1; }
.verify-btn:disabled { background: #f8bbd0; cursor: not-allowed; }

.message { margin-top: 12px; padding: 8px; border-radius: 4px; text-align: center; font-size: 14px; }
.success { background: #e6f4ea; color: #137333; }
.error { background: #fce8e6; color: #c5221f; }
</style>
