import { useState, useEffect } from "react";

export default function LoginForm(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(evt) {
    evt.preventDefault();
    props.onLogin({ username, password });
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleUsernameChange(evt) {
    setUserName(evt.target.value);
  }

  return (
    <form className='form' onSubmit={handleLogin}>
      <h1 className='form__title'>Login</h1>
      <label htmlFor='username-input'>Username</label>
      <input
        className='form__input'
        id='username-input'
        type='text'
        placeholder='Enter username'
        minLength='2'
        maxLength='40'
        value={username}
        onChange={handleUsernameChange}
        required
      />
      <label htmlFor='password-input'>Password</label>
      <input
        className='form__input'
        id='password-input'
        type='text'
        placeholder='Enter password'
        minLength='2'
        maxLength='40'
        value={password}
        onChange={handlePasswordChange}
        required
      />
      <button type='submit' className='form__button-login'>
        Login
      </button>
    </form>
  );
}
