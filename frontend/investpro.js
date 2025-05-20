async function fetchUserDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    let u = window.localStorage.getItem('token');
    u = JSON.parse(u);
    const response = await fetch('http://localhost:3000/api/users/'+userId, {
        method : 'GET',
        headers : {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${u.token}`
        }
    });
 
    const userDetails = await response.json();
    console.log(userDetails.data);
    
}

fetchUserDetails();