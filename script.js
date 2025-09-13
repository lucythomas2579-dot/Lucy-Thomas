  // --- Amount selection logic ---
  const amtEls = document.querySelectorAll('.amt');
  const customInput = document.getElementById('customAmount');
  const totalDisplay = document.getElementById('totalDisplay');
  const paypalAmountInput = document.getElementById('paypalAmount');
  let selected = 0;

  function setSelectedAmount(val){
    selected = Number(val) || 0;
    totalDisplay.textContent = selected ? '$' + selected.toLocaleString() : '$0';
    paypalAmountInput.value = selected;
    customInput.value = selected ? '' : customInput.value;
    amtEls.forEach(a => { a.classList.toggle('selected', Number(a.dataset.amount) === selected) });
  }

  amtEls.forEach(a => {
    a.addEventListener('click', () => {
      setSelectedAmount(a.dataset.amount);
    });
  });

  customInput.addEventListener('input', () => {
    const v = Number(customInput.value);
    if (v > 0) {
      selected = v;
      totalDisplay.textContent = '$' + v.toLocaleString();
      paypalAmountInput.value = v;
      amtEls.forEach(a => a.classList.remove('selected'));
    } else {
      totalDisplay.textContent = '$0';
      paypalAmountInput.value = 0;
    }
  });

  // Initialize
  setSelectedAmount(0);

  // --- Stripe button action (uses Stripe Payment Link or Checkout URL) ---
  // Replace STRIPE_CHECKOUT_URL with your real Stripe Payment Link or Checkout URL.
  const STRIPE_CHECKOUT_URL = "STRIPE_CHECKOUT_URL";
  const stripeBtn = document.getElementById('stripeBtn');
  stripeBtn.addEventListener('click', () => {
    // If the user typed an amount, we attempt to forward it by appending ?amount=... (if your payment link supports it).
    const amt = (paypalAmountInput.value && Number(paypalAmountInput.value) > 0) ? Number(paypalAmountInput.value) : 0;
    if(!STRIPE_CHECKOUT_URL || STRIPE_CHECKOUT_URL === "STRIPE_CHECKOUT_URL"){
      alert("Stripe checkout URL not set. Create a Stripe Payment Link in your Stripe dashboard and paste its URL into the site's code (STRIPE_CHECKOUT_URL).");
      return;
    }
    let url = STRIPE_CHECKOUT_URL;
    // many Stripe Payment Links do not accept query params — check your link. We append amount for custom endpoints.
    if(amt > 0){
      // This is optional. For many setups you'll create a Payment Link per price or create a server endpoint that accepts amount.
      url += (url.includes('?') ? '&' : '?') + 'amount=' + amt;
    }
    window.open(url, '_blank');
  });

  // --- Copy crypto address helper ---
  document.querySelectorAll('.copy-btn').forEach(btn=>{
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      const txt = document.getElementById(targetId).textContent.trim();
      navigator.clipboard && navigator.clipboard.writeText(txt).then(()=>{
        btn.textContent = 'Copied';
        setTimeout(()=> btn.textContent = 'Copy ' + targetId.replace('Addr','').toUpperCase(), 1200);
      }).catch(()=> alert('Copy failed — please copy manually: ' + txt));
    });
  });

  // --- Simple accessibility: keyboard activate stripe button ---
  stripeBtn.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' ') stripeBtn.click();
  });

  // --- Gallery images lazy-refresh on small screens to improve variety ---
  // (Optional) you can programmatically refresh images or provide curated images.