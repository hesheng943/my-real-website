import { create } from 'zustand';

// 全局状态管理
const useStore = create((set, get) => ({
  // 用户表单数据
  formData: {
    name: '',
    phone: '',
    industry: '',
    message: ''
  },

  // 案例数据
  cases: [],

  // 网站内容数据
  content: {
    hero: null,
    services: null
  },

  // 加载状态
  loading: {
    cases: false,
    content: false,
    form: false
  },

  // 错误状态
  error: {
    cases: null,
    content: null,
    form: null
  },

  // 更新表单数据
  updateFormData: (field, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value
      }
    }));
  },

  // 重置表单数据
  resetFormData: () => {
    set({
      formData: {
        name: '',
        phone: '',
        industry: '',
        message: ''
      }
    });
  },

  // 设置案例数据
  setCases: (cases) => {
    set({ cases });
  },

  // 设置网站内容
  setContent: (section, data) => {
    set((state) => ({
      content: {
        ...state.content,
        [section]: data
      }
    }));
  },

  // 设置加载状态
  setLoading: (key, value) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: value
      }
    }));
  },

  // 设置错误状态
  setError: (key, value) => {
    set((state) => ({
      error: {
        ...state.error,
        [key]: value
      }
    }));
  },

  // 清除错误状态
  clearError: (key) => {
    set((state) => ({
      error: {
        ...state.error,
        [key]: null
      }
    }));
  },

  // 获取案例数据
  fetchCases: async () => {
    const { setLoading, setError, setCases } = get();
    setLoading('cases', true);
    setError('cases', null);

    try {
      const response = await fetch('/api/get-cases');
      const result = await response.json();

      if (result.success) {
        setCases(result.data);
      } else {
        setError('cases', result.message || '获取案例失败');
      }
    } catch (error) {
      setError('cases', '网络错误，请稍后重试');
      console.error('获取案例失败:', error);
    } finally {
      setLoading('cases', false);
    }
  },

  // 获取内容数据
  fetchContent: async (section) => {
    const { setLoading, setError, setContent } = get();
    setLoading('content', true);
    setError('content', null);

    try {
      const response = await fetch(`/api/get-content/${section}`);
      const result = await response.json();

      if (result.success) {
        setContent(section, result.data);
      } else {
        setError('content', result.message || '获取内容失败');
      }
    } catch (error) {
      setError('content', '网络错误，请稍后重试');
      console.error('获取内容失败:', error);
    } finally {
      setLoading('content', false);
    }
  },

  // 提交表单
  submitForm: async () => {
    const { formData, setLoading, setError, resetFormData } = get();
    
    // 先设置加载状态
    setLoading('form', true);
    setError('form', null);

    console.log('[Store] 开始提交表单，表单数据:', JSON.stringify(formData, null, 2));

    try {
      // 验证必填字段
      if (!formData.name || !formData.name.trim()) {
        const errorMsg = '请输入您的姓名';
        setError('form', errorMsg);
        setLoading('form', false);
        console.error('[Store] 表单验证失败:', errorMsg);
        return { success: false, message: errorMsg };
      }

      if (!formData.phone || !formData.phone.trim()) {
        const errorMsg = '请输入您的手机号码';
        setError('form', errorMsg);
        setLoading('form', false);
        console.error('[Store] 表单验证失败:', errorMsg);
        return { success: false, message: errorMsg };
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        const errorMsg = '请输入有效的手机号码';
        setError('form', errorMsg);
        setLoading('form', false);
        console.error('[Store] 表单验证失败:', errorMsg);
        return { success: false, message: errorMsg };
      }

      console.log('[Store] 表单验证通过，准备发送请求到 /api/submit-form');

      const requestData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        industry: formData.industry ? formData.industry.trim() : '',
        message: formData.message ? formData.message.trim() : ''
      };

      console.log('[Store] 请求数据:', JSON.stringify(requestData, null, 2));

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      console.log('[Store] 收到服务器响应');
      console.log('[Store] - 状态码:', response.status);
      console.log('[Store] - 状态文本:', response.statusText);
      console.log('[Store] - Headers:', Object.fromEntries(response.headers.entries()));

      // 尝试解析响应
      let result;
      const contentType = response.headers.get('content-type');
      console.log('[Store] Content-Type:', contentType);

      if (contentType && contentType.includes('application/json')) {
        try {
          const responseText = await response.text();
          console.log('[Store] 原始响应文本:', responseText);
          result = JSON.parse(responseText);
          console.log('[Store] 解析后的响应数据:', JSON.stringify(result, null, 2));
        } catch (parseError) {
          console.error('[Store] JSON解析失败:', parseError);
          const errorMsg = '服务器响应格式错误';
          setError('form', errorMsg);
          setLoading('form', false);
          return { success: false, message: errorMsg };
        }
      } else {
        console.error('[Store] 响应不是JSON格式，Content-Type:', contentType);
        const errorMsg = '服务器响应格式不正确';
        setError('form', errorMsg);
        setLoading('form', false);
        return { success: false, message: errorMsg };
      }

      // 检查响应状态
      if (response.ok && result && result.success) {
        console.log('[Store] ✅ 表单提交成功');
        resetFormData();
        setLoading('form', false);
        return { 
          success: true, 
          message: result.message || '提交成功，我们会尽快联系您！',
          data: result.data 
        };
      } else {
        const errorMsg = result?.message || result?.error || `提交失败 (状态码: ${response.status})`;
        console.error('[Store] ❌ 表单提交失败:', errorMsg);
        console.error('[Store] 完整错误信息:', result);
        setError('form', errorMsg);
        setLoading('form', false);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      const errorMsg = error.message || '网络错误，请稍后重试';
      console.error('[Store] ❌ 表单提交异常捕获:');
      console.error('[Store] - 错误消息:', error.message);
      console.error('[Store] - 错误名称:', error.name);
      console.error('[Store] - 错误堆栈:', error.stack);
      console.error('[Store] - 表单数据:', JSON.stringify(formData, null, 2));
      
      setError('form', errorMsg);
      setLoading('form', false);
      return { success: false, message: errorMsg };
    }
  }
}));

export default useStore;