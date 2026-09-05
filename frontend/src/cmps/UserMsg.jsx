import React, { useState, useEffect } from 'react'
import { eventBusService } from '../services/event-bus.service.js'

export function UserMsg() {
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    const unsubscribe = eventBusService.on('show-user-msg', (newMsg) => {
      setMsg(newMsg)
      setTimeout(() => {
        setMsg(null)
      }, 3500)
    })
    return () => unsubscribe()
  }, [])

  if (!msg) return null

  return (
    <div className={`user-msg ${msg.type}`}>
      <span>{msg.type === 'error' ? '⚠️' : '✨'}</span>
      <span>{msg.txt}</span>
    </div>
  )
}
