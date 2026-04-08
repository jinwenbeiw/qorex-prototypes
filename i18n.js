/**
 * Qorex i18n - 轻量级国际化方案
 * 支持语言：zh-CN, zh-TW, en-US, ja-JP, ko-KR
 */

const i18n = {
  currentLang: 'zh-CN',
  defaultLang: 'zh-CN',
  messages: {},
  
  // 语言名称映射
  languages: {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English',
    'ja-JP': '日本語',
    'ko-KR': '한국어'
  },
  
  // 初始化
  async init() {
    // 1. 从 localStorage 读取用户选择
    const saved = localStorage.getItem('qorex_lang');
    // 2. 从 URL 参数读取
    const url = new URLSearchParams(window.location.search).get('lang');
    // 3. 从浏览器读取
    const browser = navigator.language;
    
    // 优先级：localStorage > URL > browser > default
    const lang = saved || url || browser || this.defaultLang;
    await this.setLang(lang);
  },
  
  // 设置语言
  async setLang(lang) {
    if (!this.languages[lang]) {
      lang = this.defaultLang;
    }
    
    this.currentLang = lang;
    localStorage.setItem('qorex_lang', lang);
    
    try {
      const response = await fetch(`locales/${lang}.json`);
      this.messages = await response.json();
      
      // 更新页面所有翻译
      this.updateDOM();
      
      // 触发事件
      window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    } catch (error) {
      console.error('Failed to load language:', lang, error);
    }
  },
  
  // 翻译函数
  t(key) {
    const value = key.split('.').reduce((obj, k) => obj?.[k], this.messages);
    return value || key;
  },
  
  // 更新 DOM
  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });
  }
};

// 辅助函数
function t(key) {
  return i18n.t(key);
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});
