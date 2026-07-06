export function estimateGaze(landmarks){
  if(!landmarks || landmarks.length === 0) return {x:0,y:0,confidence:0}

  // Helper to average selected indices
  const avgPoint = (idxs) => {
    let x=0,y=0,n=0
    for(const i of idxs){
      const lm = landmarks[i]
      if(!lm) continue
      x += lm.x
      y += lm.y
      n++
    }
    if(n===0) return null
    return {x:x/n, y:y/n}
  }

  // Typical MediaPipe FaceMesh indices for eyes (approx)
  const leftEyeIdx = [33,133,160,159,158,157,173]
  const rightEyeIdx = [362,263,387,386,385,384,398]

  const left = avgPoint(leftEyeIdx)
  const right = avgPoint(rightEyeIdx)

  // face bounding box
  let minX=1, maxX=0, minY=1, maxY=0
  for(const lm of landmarks){
    if(!lm) continue
    if(lm.x < minX) minX = lm.x
    if(lm.x > maxX) maxX = lm.x
    if(lm.y < minY) minY = lm.y
    if(lm.y > maxY) maxY = lm.y
  }
  const faceWidth = Math.max(0.001, maxX - minX)
  const faceHeight = Math.max(0.001, maxY - minY)
  const faceCenter = {x: (minX+maxX)/2, y: (minY+maxY)/2}

  const eyeCenter = (() => {
    if(left && right) return {x:(left.x+right.x)/2, y:(left.y+right.y)/2}
    if(left) return left
    if(right) return right
    return faceCenter
  })()

  // Normalize to [-1,1] relative to face bounding box
  const x = ((eyeCenter.x - faceCenter.x) / faceWidth) * 2
  const y = ((eyeCenter.y - faceCenter.y) / faceHeight) * 2

  // Confidence heuristic: number of landmarks present near eyes
  let present = 0
  for(const i of [...leftEyeIdx, ...rightEyeIdx]) if(landmarks[i]) present++
  const confidence = Math.min(1, present / (leftEyeIdx.length + rightEyeIdx.length))

  return {x, y, confidence}
}
