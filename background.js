// 确保有这段代码
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('收到请求:', request.type);

  if (request.type === 'chatWithDeepSeek') {
    // 增强的权限检查
    if (typeof chrome.storage === 'undefined' || 
        typeof chrome.storage.local === 'undefined') {
      console.error('Storage API不可用，请检查：');
      console.error('1. manifest.json是否包含"storage"权限');
      console.error('2. 是否使用Manifest V3');
      console.error('3. 扩展是否已正确加载');
      return sendResponse({ 
        error: 'Storage权限未启用，请刷新扩展或检查manifest配置' 
      });
    }

    (async () => {
      try {
        const result = await chrome.storage.local.get(['deepseekApiKey']);
        if (!result.deepseekApiKey) {
          return sendResponse({ error: '请先在选项中设置API密钥' });
        }

        const apiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${result.deepseekApiKey}`
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{role: "user", content: request.message}]
          })
        });

        const data = await apiResponse.json();
        console.log('API响应数据:', data);
        sendResponse(data);
      } catch (error) {
        console.error('处理请求出错:', error);
        sendResponse({ error: error.message });
      }
    })();
    
    return true;
  }
});