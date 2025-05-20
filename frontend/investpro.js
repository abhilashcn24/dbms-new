async function fetchUserDetails() {

    let u = window.localStorage.getItem('token');
    u = JSON.parse(u);
    const response = await fetch('http://localhost:3000/api/users/'+u.user.id, {
        method : 'GET',
        headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${u.token}`
        }
    });
 
    const userDetails = await response.json();
    console.log(userDetails.data);
    const main = document.querySelector('.profile-card');

    const profileDetails = document.createElement('div');
    profileDetails.className = 'profile-details';
    
    const error = document.getElementById('responseMsg');
    
    
    profileDetails.innerHTML = 
    `
    <div class="detail-row"><strong>Name:</strong> ${userDetails.data.name}</div>
        <div class="detail-row"><strong>PAN No:</strong> ${userDetails.data.panNumber}</div>
        <div class="detail-row"><strong>Aadhaar No:</strong> ${userDetails.data.aadhaarNumber}</div>
        <div class="detail-row"><strong>Phone No:</strong> ${userDetails.data.phone}</div>
        <div class="detail-row"><strong>Email:</strong> ${userDetails.data.email}</div>
        <button class="logout-button">Logout</button>
    `
    main.appendChild(profileDetails);

    const logoutButton = document.querySelector('.logout-button');
  logoutButton.addEventListener('click', () => {
    const error = document.getElementById('responseMsg');
    error.style.visibility = 'visible'; 
    error.innerText = 'Logging Out.....';
    setTimeout(()=> {
    window.localStorage.removeItem('token');
    window.location.href = '/frontend/index.html';
    }, 3000);
     
  });
    
}


document.addEventListener('DOMContentLoaded', () => {
    fetchUserDetails();
  
})
