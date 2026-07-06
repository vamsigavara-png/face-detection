import React, { useRef, useState, useEffect } from 'react'
import useFaceDetection from '../hooks/useFaceDetection'
import useGazeTracking from '../hooks/useGazeTracking'

export default function Webcam({onGaze, onFacesCount}){
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const {gaze, processLandmarks} = useGazeTracking()
  const [facesCount, setFacesCount] = useState(0)

  const handleResults = (results) => {
    const multi = results?.multiFaceLandmarks || []
    setFacesCount(multi.length)
    if(multi.length > 0){
      // For now, process the first face
      processLandmarks(multi[0])
    }
  }

  useEffect(()=>{
    if(onGaze) onGaze(gaze)
  },[gaze, onGaze])

  useEffect(()=>{
    if(onFacesCount) onFacesCount(facesCount)
  },[facesCount, onFacesCount])

  useFaceDetection(videoRef, canvasRef, handleResults)

  return (
    <div>
      <video ref={videoRef} playsInline muted style={{display:'none'}} />
      <div style={{position:'relative'}}>
        <canvas ref={canvasRef} className="webcam-placeholder" />
        <div style={{position:'absolute',left:12,top:12,color:'#fff'}}>
          <div>Webcam</div>
          <div>Faces: {facesCount}</div>
          <div>Gaze: x={gaze.x.toFixed(2)} y={gaze.y.toFixed(2)} c={gaze.confidence.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
