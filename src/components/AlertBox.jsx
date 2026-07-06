import React from 'react'

export default function AlertBox({children, onDismiss, id}){
  if(!children) return null
  return (
    <div className="alert-box">
      <button className="alert-close" onClick={()=>onDismiss && onDismiss(id)}>×</button>
      <div className="alert-content">{children}</div>
    </div>
  )
}
