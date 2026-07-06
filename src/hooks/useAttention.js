import { useState, useRef, useEffect, useCallback } from 'react'

export default function useAttention({alertsPush, threshold=0.6, timeoutSec=5}){
  const [awaySeconds, setAwaySeconds] = useState(0)
  const [isAway, setIsAway] = useState(false)
  const lastChangeRef = useRef(Date.now())
  const alertedRef = useRef(false)

  const reset = useCallback(()=>{
    setAwaySeconds(0)
    setIsAway(false)
    lastChangeRef.current = Date.now()
    alertedRef.current = false
  },[])

  useEffect(()=>{
    const iv = setInterval(()=>{
      const now = Date.now()
      const elapsed = (now - lastChangeRef.current)/1000
      setAwaySeconds(elapsed)
      setIsAway(elapsed > 0)
      if(elapsed >= timeoutSec && !alertedRef.current){
        alertedRef.current = true
        if(alertsPush) alertsPush(`User away for ${timeoutSec} seconds`)
      }
    }, 200)
    return ()=> clearInterval(iv)
  },[alertsPush, timeoutSec])

  const feed = useCallback((gaze)=>{
    if(!gaze) return
    const {x=0,y=0,confidence=0} = gaze
    const isLookingAway = (confidence < 0.45) || (Math.abs(x) > threshold) || (Math.abs(y) > threshold*1.5)
    if(isLookingAway){
      // start/continue away timer
      // lastChangeRef is time when away started
      if(lastChangeRef.current === null) lastChangeRef.current = Date.now()
      // if previously attentive, set start time
      if(!isAway){
        lastChangeRef.current = Date.now()
      }
    }else{
      // attentive -> reset
      lastChangeRef.current = Date.now()
      if(alertedRef.current) alertedRef.current = false
      setAwaySeconds(0)
      setIsAway(false)
    }
  },[threshold,isAway])

  return {awaySeconds, isAway, feed, reset}
}
