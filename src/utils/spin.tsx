
const spinHTML = '<div class="ant-spin ant-spin-spinning"><span class="ant-spin-dot ant-spin-dot-spin"><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i></span></div>';
let containerEl: HTMLElement;

function start() {
  try {
    if (document.querySelector('.spin-loading')) {
      return;
    }

    containerEl = containerEl || document.getElementById('container') as HTMLElement;
    const spinEl = document.createElement('div');
    spinEl.className = 'spin-loading';
    spinEl.innerHTML = spinHTML;
    containerEl.appendChild(spinEl);
  } catch (_) {}
}

function done() {
  try {
    const spin = document.querySelector('.spin-loading') as any;
    if (!spin) return;
    spin.parentNode.removeChild(spin);
  } catch (_) {}
}

export const spin = { start, done };
