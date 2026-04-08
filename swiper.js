/**
 * Qorex Swiper - 轻量级轮播图组件
 * 功能：自动轮播、触摸滑动、指示器、无缝循环
 */

class Swiper {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!this.container) {
      console.error('Swiper container not found');
      return;
    }
    
    this.options = {
      autoplay: true,
      interval: 5000,
      loop: true,
      indicators: true,
      ...options
    };
    
    this.currentIndex = 0;
    this.items = [];
    this.timer = null;
    
    this.init();
  }
  
  init() {
    // 创建结构
    this.container.innerHTML = `
      <div class="swiper-wrapper">
        ${this.renderItems()}
      </div>
      ${this.options.indicators ? '<div class="swiper-indicators"></div>' : ''}
    `;
    
    this.wrapper = this.container.querySelector('.swiper-wrapper');
    this.items = this.container.querySelectorAll('.swiper-item');
    
    if (this.options.indicators) {
      this.indicatorsContainer = this.container.querySelector('.swiper-indicators');
      this.renderIndicators();
    }
    
    // 绑定事件
    this.bindEvents();
    
    // 自动播放
    if (this.options.autoplay) {
      this.startAutoplay();
    }
    
    // 初始位置
    this.updatePosition();
  }
  
  renderItems() {
    const items = this.options.items || [];
    return items.map((item, index) => `
      <div class="swiper-item" data-index="${index}" onclick="location.href='${item.link || '#'}'">
        <div class="swiper-image" style="background-image: url('${item.image}')"></div>
        <div class="swiper-content">
          <div class="swiper-title">${item.title || ''}</div>
          <div class="swiper-subtitle">${item.subtitle || ''}</div>
        </div>
      </div>
    `).join('');
  }
  
  renderIndicators() {
    const count = this.items.length;
    this.indicatorsContainer.innerHTML = Array.from({ length: count }, (_, i) => 
      `<span class="swiper-indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');
    
    this.indicators = this.indicatorsContainer.querySelectorAll('.swiper-indicator');
    
    // 绑定指示器点击事件
    this.indicators.forEach(indicator => {
      indicator.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.goTo(index);
      });
    });
  }
  
  bindEvents() {
    let startX = 0;
    let isDragging = false;
    
    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.pauseAutoplay();
    });
    
    this.container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diff = startX - e.touches[0].clientX;
      if (Math.abs(diff) > 50) {
        isDragging = false;
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    });
    
    this.container.addEventListener('touchend', () => {
      isDragging = false;
      this.startAutoplay();
    });
    
    // 鼠标事件（桌面端）
    this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());
  }
  
  updatePosition() {
    this.wrapper.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    
    // 更新指示器
    if (this.indicators) {
      this.indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === this.currentIndex);
      });
    }
  }
  
  next() {
    if (this.currentIndex >= this.items.length - 1) {
      this.currentIndex = this.options.loop ? 0 : this.currentIndex;
    } else {
      this.currentIndex++;
    }
    this.updatePosition();
  }
  
  prev() {
    if (this.currentIndex <= 0) {
      this.currentIndex = this.options.loop ? this.items.length - 1 : 0;
    } else {
      this.currentIndex--;
    }
    this.updatePosition();
  }
  
  goTo(index) {
    this.currentIndex = index;
    this.updatePosition();
  }
  
  startAutoplay() {
    if (!this.options.autoplay || this.timer) return;
    
    this.timer = setInterval(() => {
      this.next();
    }, this.options.interval);
  }
  
  pauseAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  destroy() {
    this.pauseAutoplay();
    this.container.innerHTML = '';
  }
}

// 全局注册
window.Swiper = Swiper;

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-swiper]').forEach(container => {
    const items = JSON.parse(container.dataset.swiper || '[]');
    new Swiper(container, { items, autoplay: true, interval: 5000 });
  });
});
