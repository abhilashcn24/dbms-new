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
      const book = document.querySelector('.book-now');
      book.addEventListener('click', () => {
        window.location.href = '/frontend/invested.html?id='+propertyId;
      })
      console.log("Fetched property:", property);
  
      // Update text content
      document.getElementById('property-name').textContent = property.name;
      document.getElementById('property-type').textContent = property.type;
      document.getElementById('property-location').textContent = property.area;
      document.getElementById('property-status').textContent = property.status;
      document.getElementById('property-price').textContent = property.price;
  
      // Update image src and alt
      const imgEl = document.getElementById('property-image');
      imgEl.src = property.images?.[0] || '';
      imgEl.alt = property.name;
  
      // Split description into two halves
      const description = property.description || '';
      const words = description.split(' ');
      const mid = Math.ceil(words.length / 2);
      const firstHalf = words.slice(0, mid).join(' ');
      const secondHalf = words.slice(mid).join(' ');
  
      // Set first half in description
      document.getElementById('property-description').innerHTML = firstHalf;
  
      // Add second half as points in amenities
      const amenitiesListEl = document.getElementById('amenities-list');
      const allAmenities = (property.amenities || []).concat(secondHalf.split('.').filter(Boolean));
      amenitiesListEl.innerHTML = allAmenities.map(item => `<li>${item.trim()}</li>`).join('');
  
      // Update map iframe src based on location
      const mapIframe = document.getElementById('property-map');

      const query = encodeURIComponent(property.area || '');
      console.log(query);
      
      mapIframe.src = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  
      console.log("Map query:", mapIframe.src);
  
    } catch (error) {
      console.error("Failed to load property:", error);
      document.body.innerHTML = '<p>Failed to load property details.</p>';
    }
  }
  
  window.addEventListener('DOMContentLoaded', loadPropertyDetails);
  
  