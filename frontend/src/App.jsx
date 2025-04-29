import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterMessage('');

    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setRegisterMessage(`Error: ${data.error}`);
        } else {
          setRegisterMessage(data.message);
          setUsername('');
          setPassword('');
          fetch('http://localhost:5000/api/users')
            .then((response) => response.json())
            .then((data) => setUsers(data));
        }
      })
      .catch((error) => {
        setRegisterMessage('Error registering user');
        console.error('Error:', error);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginMessage('');

    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: loginUsername, password: loginPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setLoginMessage(`Error: ${data.error}`);
        } else {
          setLoginMessage(data.message);
          setLoginUsername('');
          setLoginPassword('');
        }
      })
      .catch((error) => {
        setLoginMessage('Error logging in');
        console.error('Error:', error);
      });
  };

  return (
    <>
      <div className='flex gap-10 justify-center'>
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegister} className='flex flex-col items-center gap-3 pt-2'>
            <input className='border-1 rounded-full pl-2 py-1' type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder='username'/>
            <input className='border-1 rounded-full pl-2 py-1' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='password' />
            <button className="border-1 p-2 rounded-full px-3 bg-gray-200" type="submit">Register</button>
          </form>
          {registerMessage && <p>{registerMessage}</p>}
        </div>
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin} className='flex flex-col items-center gap-3 pt-2'>
            <input className='border-1 rounded-full pl-2 py-1' type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} required placeholder='username'/>
            <input className='border-1 rounded-full pl-2 py-1' type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required placeholder='password' />
            <button className="border-1 p-2 rounded-full px-3 bg-gray-200" type="submit">Login</button>
          </form>
          {loginMessage && <p>{loginMessage}</p>}
        </div>
      </div>
      

      <h2 className='pt-10'>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            ID: {user.id}, Username: {user.username}, Hash: {user.hash}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
