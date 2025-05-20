async function loadPropertyDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    if (!propertyId) {
      document.body.innerHTML = '<p>Invalid property ID</p>';
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/properties/${propertyId}`);
      const property = await res.json();

      // 🔁 Fill details dynamically
      document.querySelector('.hero img').src = property.images?.[0] || 'svg/default.jpg';
      document.querySelector('.price').textContent = `From ₹${property.price || 'N/A'}`;
      document.querySelector('section.tab-content:nth-of-type(4) p').innerHTML = `
        <strong>Name:</strong> ${property.name}<br>
        <strong>Type:</strong> ${property.type}<br>
        <strong>Location:</strong> ${property.area}<br>
        <strong>Status:</strong> ${property.status}<br>
        <strong>Description:</strong> ${property.description}
      `;
    } catch (err) {
      console.error('Failed to load property:', err);
      document.body.innerHTML = '<p>Failed to load property.</p>';
    }
  }

  loadPropertyDetails();