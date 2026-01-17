import { useEffect, useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/hello').then(async (req) => {
      return await req.json()
    }).then((res) => {
      setMessage(res.message)
    })
  })

  return (
    <div className='p-4'>
      <p className='font-semibold text-2xl'>{message}</p>
      <Button>Button</Button>
    </div>
  )
}

export default App
