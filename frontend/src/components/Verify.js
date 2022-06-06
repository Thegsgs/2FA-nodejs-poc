import { useState } from "react";

export default function Verify(props) {
  const [code, setCode] = useState("");

  function onCodeChange(evt) {
    setCode(evt.target.value);
  }

  function handleCodeSubmit(evt) {
    evt.preventDefault();
    props.onVerify(code);
  }

  return (
    <>
      <img className='qrcode' src={props.qrcode} alt='verification qr code' />
      <form className='code-form' onSubmit={handleCodeSubmit}>
        <input
          className='verify-input'
          id='username-input'
          type='text'
          placeholder='Enter code from authenticator'
          minLength='2'
          maxLength='40'
          value={code}
          onChange={onCodeChange}
          required
        />
        <button className='code-button' type='submit'>
          Submit
        </button>
      </form>
    </>
  );
}
