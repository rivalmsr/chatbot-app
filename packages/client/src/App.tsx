import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/hello').then(async (req) => {
      return await req.json()
    }).then((res) => {
      setMessage(res.message)
    })
  })


  return <div>{message}</div>
}

export default App
