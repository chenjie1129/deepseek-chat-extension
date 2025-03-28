document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('send');
  const input = document.getElementById('input');
  
  sendBtn.addEventListener('click', async () => {
    const message = input.value.trim();
    if (!message) return;
    
    // 先显示用户发送的消息
    addMessage('user', message);
    
    // 清除输入框
    input.value = '';
    
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'chatWithDeepSeek',
        message: message,
        show_reasoning: true  // 请求返回推理过程
      });

      if (response.choices?.[0]?.message?.content) {
        // 解析可能包含推理过程的响应
        const content = response.choices[0].message.content;
        try {
          // 尝试解析为JSON（如果API返回结构化数据）
          const parsed = JSON.parse(content);
          addMessage('assistant', parsed);
        } catch {
          // 普通文本响应
          addMessage('assistant', content);
        }
      }
    } catch (error) {
      addMessage('system', `错误: ${error.message}`);
    }
  });
});

function addMessage(role, content) {
  const chat = document.getElementById('chat');
  const div = document.createElement('div');
  
  // 添加角色样式类
  div.className = `message ${role}`;
  
  if (typeof content === 'object' && content.reasoning) {
    // 处理包含推理过程的结构化响应
    const header = document.createElement('div');
    header.textContent = `${role}: ${content.final_answer || '思考中...'}`;
    div.appendChild(header);
    
    const reasoning = document.createElement('div');
    reasoning.className = 'reasoning';
    reasoning.textContent = `推理过程: ${content.reasoning}`;
    div.appendChild(reasoning);
  } else {
    // 普通文本消息
    div.textContent = `${role}: ${content}`;
  }
  
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}