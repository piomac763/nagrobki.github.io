// small UI niceties
document.getElementById('year').textContent = new Date().getFullYear();
// lightbox simple
document.querySelectorAll('.lightbox').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const src = a.getAttribute('href');
    const overlay = document.createElement('div');
    overlay.style.position='fixed';overlay.style.inset=0;overlay.style.background='rgba(0,0,0,0.8)';overlay.style.display='flex';overlay.style.alignItems='center';overlay.style.justifyContent='center';overlay.style.zIndex=9999;
    const img = document.createElement('img');img.src=src;img.style.maxWidth='90%';img.style.maxHeight='90%';img.style.borderRadius='8px';
    overlay.appendChild(img);
    overlay.addEventListener('click',()=>document.body.removeChild(overlay));
    document.body.appendChild(overlay);
  })
});

// (Reviews removed) keep existing DOM-ready setup for other features
document.addEventListener('DOMContentLoaded', ()=>{
  // Contact form submit via AJAX to Formspree
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      // Validate phone contains only digits
      const phoneVal = (contactForm.querySelector('#phone') || {value:''}).value.trim();
      if(!/^[0-9]+$/.test(phoneVal)){
        showFormMessage(contactForm, 'Numer telefonu może zawierać tylko cyfry.', 'error');
        return;
      }
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      const formData = new FormData(contactForm);
      try{
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        if(res.ok){
          showFormMessage(contactForm, 'Dziękujemy — wiadomość została wysłana.', 'success');
          contactForm.reset();
        }else{
          const data = await res.json().catch(()=>({}));
          const err = (data && data.error) ? data.error : 'Wystąpił błąd podczas wysyłki.';
          showFormMessage(contactForm, err, 'error');
        }
      }catch(err){
        showFormMessage(contactForm, 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.', 'error');
      }finally{
        submitBtn.disabled = false;
      }
    });
  }

  function showFormMessage(form, message, type){
    let el = form.querySelector('.form-feedback');
    if(!el){
      el = document.createElement('div');
      el.className = 'form-feedback';
      form.appendChild(el);
    }
    el.textContent = message;
    el.className = 'form-feedback ' + (type === 'success' ? 'form-success' : 'form-error');
    setTimeout(()=>{ if(el) el.classList.add('visible'); }, 20);
    // hide after 6s
    setTimeout(()=>{ if(el) el.classList.remove('visible'); }, 6000);
  }
});
