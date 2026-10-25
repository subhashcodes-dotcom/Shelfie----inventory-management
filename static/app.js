// 1. DOM helpers and modal controls
function byId(id) {
    return document.getElementById(id);
}
function openAddProduct() {
    const el=byId('addProduct');
    if(el)el.classList.add('open');
}
function openFilter() {
    const el=byId('filterModal');
    if(el)el.classList.add('open');
}
function openScanner() {
    const el=byId('scanner');
    if(el) {
        el.classList.add('open');
        startScanner();
    }
}
function closeModal(id) {
    const el=byId(id);
    if(el)el.classList.remove('open');
    if(id==='scanner')stopScanner();
}
// 2. Theme switching
function toggleTheme() {
    const dark=!document.body.classList.contains('dark-mode');
    document.body.classList.toggle('dark-mode',dark);
    localStorage.setItem('shelfie-theme',dark?'dark':'light');
    syncThemeButton();
}
function syncThemeButton() {
    const btn=byId('themeToggle');
    if(!btn)return;
    const dark=document.body.classList.contains('dark-mode');
    btn.textContent=dark?'☀':'☾';
    btn.title=dark?'Switch to light mode':'Switch to dark mode';
    btn.setAttribute('aria-label',btn.title);
}
// 3. Inventory row actions
function toggleRow(id) {
    const el=byId('menu-'+id);
    if(!el)return;
    document.querySelectorAll('.row-menu').forEach(x=> {
        if(x!==el)x.classList.remove('show');
    }
    );
    el.classList.toggle('show');
}
function adjustStock(id,delta,reason) {
    const form=byId('adjustForm');
    if(!form)return;
    byId('adjustVariant').value=id;
    byId('adjustDelta').value=delta;
    byId('adjustReason').value=reason||'manual adjustment';
    form.submit();
}
// 4. Inventory assistant helpers
function fillAssistant(q,ask=false) {
    const input=document.querySelector('.assistant-input input');
    const form=input?input.closest('form'):null;
    if(!input||!form)return;
    input.value=q;
    if(ask) {
        if(form.requestSubmit)form.requestSubmit();
        else form.submit();
    }
}
// 5. Barcode scanner
let scannerStream=null;
async function startScanner() {
    const video=byId('scanVideo');
    if(!video)return;
    if(!('BarcodeDetector' in window)) {
        return;
    }
    try {
        scannerStream=await navigator.mediaDevices.getUserMedia( {
            video: {
                facingMode:'environment'
            }
        }
        );
        video.srcObject=scannerStream;
        const detector=new BarcodeDetector();
        const scan=async()=> {
            if(!byId('scanner')?.classList.contains('open')) {
                stopScanner();
                return;
            }
            try {
                const codes=await detector.detect(video);
                if(codes.length) {
                    byId('manualSku').value=codes[0].rawValue;
                    searchSku();
                    return;
                }
            } catch(e) {
            }
            requestAnimationFrame(scan);
        }
        ;
        scan();
    } catch(e) {
    }
}
function stopScanner() {
    if(scannerStream) {
        scannerStream.getTracks().forEach(t=>t.stop());
        scannerStream=null;
    }
    const video=byId('scanVideo');
    if(video)video.srcObject=null;
}
function searchSku() {
    const input=byId('manualSku');
    const v=input?input.value.trim():'';
    if(!v)return;
    const result=byId('scanResult');
    if(result)result.innerHTML='<div class="info-box">Searching catalog for <b>'+v+'</b>…</div>';
    window.location='/warehouse?q='+encodeURIComponent(v);
}
// 6. Initialize saved theme and close menus
// Apply saved theme as early as possible when this script loads.
(function() {
    if(localStorage.getItem('shelfie-theme')==='dark')document.body.classList.add('dark-mode'); syncThemeButton();
}
)();
// Close pop-up row menus when clicking elsewhere.
document.addEventListener('click',function(e) {
    if(!e.target.closest('.dots')&&!e.target.closest('.row-menu'))document.querySelectorAll('.row-menu').forEach(x=>x.classList.remove('show'));
}
);
