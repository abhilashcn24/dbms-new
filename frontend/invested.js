function formatIndianCurrency(priceStr) {
    if (!priceStr) return "0";
  
    // Split by dash if range, or use single value
    const parts = priceStr.split(' ').map(p => p.trim());
    const part = parts.map(part => part.toLowerCase());
    
    console.log(part);
    let num = 0;
    if (part.includes('l')) {
         num = parseFloat(part[0]) * 100000
    }
    else{
        num = parseFloat(part[0]) * 10000000
    }
    
  
    // Format as Indian currency with commas
    return new Intl.NumberFormat('en-IN').format(num);
  }


  function parseIndianCurrency(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/,/g, ''));
  }


async function addInvestmentDetails (propertyId,amount, sharesPercent){
    let u = window.localStorage.getItem('token');
    u = JSON.parse(u);
    let payload = {
        property : propertyId,
        amountInvested : parseFloat(amount),
        sharesPercent : parseFloat(sharesPercent)
    }
    
    
    
    try {


        console.log(u.token);
        
        const resp = document.getElementById("responseMsg");
        const  response = await fetch('http://localhost:3000/api/investments', {
            method : 'POST',
            headers: { 
               'Content-Type': 'application/json',
               'Authorization' : `Bearer ${u.token}`         
             },
            body: JSON.stringify(payload),
        });

        if(response.status == '401'){
            resp.innerHTML = `<p class="error">Already Invested On This Property</p>`;
            
        }
        if (response.status = '201') {
            resp.innerHTML = `<p class="success">Successfully invested</p>`
            setTimeout(() => {
                window.location.href = "/frontend/invsetpro.htm?id="+u.user.id;
            },3000);
        }
        console.log(response.status);
        
        
    }catch (Err){
        console.log("Error message" + Err);
        
    }

}

async function fetchPropertyDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
  
    if (!propertyId) {
      document.body.innerHTML = '<p>Invalid property ID</p>';
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:3000/api/properties/${propertyId}`);
      const property = await res.json();
      const text_box = document.getElementById('property');
      const amount = document.getElementById('amountInvested');
      const p = document.getElementById('propertyPrice');
      const parea = document.getElementById('propertyArea');
      const pname = document.getElementById('propertyName');
      const pshare = document.getElementById('sharesPercent');
      const submit = document.getElementById("submit");
      parea.value = property.area
      pname.value = property.name
      text_box.addEventListener('keypress', (e)=>{
        e.preventDefault();
      });
      text_box.readOnly = true;
      text_box.value = propertyId
      console.log(property.price);
      const price = formatIndianCurrency(property.price)
      p.value = price;
      console.log(formatIndianCurrency(property.price));

      amount.addEventListener('change', () => {
        if (amount.value === '') {
          pshare.value = "0%";
          console.log("Empty amount");
        } else {
          const numAmount = parseFloat(amount.value);
          const numPrice = parseIndianCurrency(price); // parse formatted price back to number
          if (!isNaN(numAmount) && numPrice > 0) {
            const sharePercent = (numAmount / numPrice) * 100;
            pshare.value = sharePercent.toFixed(2) + "%";
          } else {
            pshare.value = "0%";
          }
        }
      });

      console.log();
      
      submit.addEventListener('click', (e) => {
         e.preventDefault();
         
         addInvestmentDetails(propertyId,amount.value, pshare.value);
      })
    }catch (error) {
        console.error("Failed to load property:", error);
        document.body.innerHTML = '<p>Failed to load property details.</p>';
      }
}

fetchPropertyDetails();

