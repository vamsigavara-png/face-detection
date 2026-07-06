import { useState, useCallback } from 'react'
import { estimateGaze } from '../utils/gazeTracker'

export default function useGazeTracking(){
  const [gaze, setGaze] = useState({x:0,y:0,confidence:0})

  const processLandmarks = useCallback((landmarks) => {
    if(!landmarks) return
    const g = estimateGaze(landmarks)
    setGaze(g)
  }, [])

  return {gaze, processLandmarks, setGaze}
}
