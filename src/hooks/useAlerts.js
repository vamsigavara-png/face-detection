import { useState, useCallback } from 'react'

export default function useAlerts(){
  const [alerts, setAlerts] = useState([])

  const push = useCallback((msg)=>{
    const id = Date.now()
    setAlerts(a=>[...a,{id,msg}])
    try{
      const Ctx = window.AudioContext || window.webkitAudioContext
      if(Ctx){
        const ctx = new Ctx()
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'
        o.frequency.value = 880
        o.connect(g)
        g.connect(ctx.destination)
        g.gain.setValueAtTime(0.0001, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01)
        o.start()
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
        o.stop(ctx.currentTime + 0.19)
      }
    }catch(e){}
    return id
  },[])

  const remove = useCallback((id)=> setAlerts(a=>a.filter(x=>x.id!==id)),[])

  return {alerts, push, remove, setAlerts}
}
