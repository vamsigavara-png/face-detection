import { useEffect } from 'react'
import { FaceMesh } from '@mediapipe/face_mesh'

export default function useFaceDetection(videoRef, canvasRef, onResults){
  useEffect(()=>{
    if(!videoRef?.current) return
    let mounted = true
    let faceMesh = null

    async function init(){
      const video = videoRef.current

      faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      })

      faceMesh.setOptions({
        maxNumFaces: 4,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      })

      faceMesh.onResults((results) => {
        if(!mounted) return
        if(onResults) onResults(results)

        const canvas = canvasRef?.current
        if(!canvas || !video) return
        const ctx = canvas.getContext('2d')
        canvas.width = video.videoWidth || video.clientWidth
        canvas.height = video.videoHeight || video.clientHeight
        ctx.clearRect(0,0,canvas.width,canvas.height)

        if(results.multiFaceLandmarks){
          for(const landmarks of results.multiFaceLandmarks){
            ctx.fillStyle = 'rgba(0,255,0,0.8)'
            for(const lm of landmarks){
              const x = lm.x * canvas.width
              const y = lm.y * canvas.height
              ctx.beginPath()
              ctx.arc(x,y,2,0,Math.PI*2)
              ctx.fill()
            }
          }
        }
      })

      try{
        const stream = await navigator.mediaDevices.getUserMedia({video:true})
        video.srcObject = stream
        await video.play()

        async function frameLoop(){
          if(!mounted) return
          try{
            await faceMesh.send({image: video})
          }catch(e){
            // ignore occasional send errors
          }
          requestAnimationFrame(frameLoop)
        }
        frameLoop()
      }catch(err){
        console.error('useFaceDetection camera error', err)
      }
    }

    init()

    return ()=>{
      mounted = false
      try{ if(faceMesh) faceMesh.close() }catch(e){}
      const vid = videoRef.current
      if(vid && vid.srcObject){
        const tracks = vid.srcObject.getTracks()
        tracks.forEach(t=>t.stop())
        vid.srcObject = null
      }
    }
  },[videoRef, canvasRef, onResults])
}
