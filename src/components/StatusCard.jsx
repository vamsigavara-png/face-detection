import React from 'react'

export default function StatusCard({title, value}){
  return (
    <div className="status-card">
      <strong>{title}</strong>
      <div>{value}</div>
    </div>
  )
}
