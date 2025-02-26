

const login = async () => {
  const userData = {
      email: document.getElementById('email').value, 
      password: document.getElementById('password').value
  };

  try {
      const response = await fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      console.log(data);

      localStorage.setItem('authToken', data.token);
      window.location.href = "index.html";

  } catch (error) {
      console.error('Error', error);
      alert("Login failed!")
  }
};

document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  login();
});






  