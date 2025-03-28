document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('save');
  const clearBtn = document.getElementById('clear');
  const statusDiv = document.getElementById('status');

  // 加载已保存的密钥
  chrome.storage.local.get(['deepseekApiKey'], (result) => {
    if (result.deepseekApiKey) {
      apiKeyInput.value = result.deepseekApiKey;
    }
  });

  // 保存密钥
  // 在保存密钥后添加状态检查
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({ deepseekApiKey: apiKey }, () => {
        // 添加存储验证
        chrome.storage.local.get(['deepseekApiKey'], (result) => {
          console.log('当前存储的密钥:', result.deepseekApiKey);
        });
        statusDiv.textContent = '密钥已保存';
        statusDiv.style.color = 'green';
        setTimeout(() => statusDiv.textContent = '', 2000);
      });
    }
  });

  // 清除密钥
  clearBtn.addEventListener('click', () => {
    chrome.storage.local.remove('deepseekApiKey', () => {
      apiKeyInput.value = '';
      statusDiv.textContent = '密钥已清除';
      statusDiv.style.color = 'red';
      setTimeout(() => statusDiv.textContent = '', 2000);
    });
  });
});