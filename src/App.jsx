import React, { useState } from 'react'
import Webcam from './components/Webcam'
import Navbar from './components/Navbar'
import StatusCard from './components/StatusCard'
import Timer from './components/Timer'
import useAlerts from './hooks/useAlerts'
import useAttention from './hooks/useAttention'
import AlertBox from './components/AlertBox'

export default function App(){
  const [faces, setFaces] = useState(0)
  const [gaze, setGaze] = useState({x:0,y:0,confidence:0})
  const {alerts, push, remove} = useAlerts()
  const {awaySeconds, isAway, feed} = useAttention({alertsPush: push, timeoutSec:5})

  const handleGaze = (g) => {
    setGaze(g)
    feed(g)
  }

  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <section className="left">
          <Webcam onGaze={handleGaze} onFacesCount={setFaces} />
        </section>
        <section className="right">
          <h2>Status</h2>
          <StatusCard title="Faces" value={faces} />
          <StatusCard title="Gaze" value={`x:${gaze.x.toFixed(2)} y:${gaze.y.toFixed(2)} c:${gaze.confidence.toFixed(2)}`} />
          <StatusCard title="Away Timer" value={<Timer seconds={Math.ceil(awaySeconds)} />} />
          <div style={{marginTop:12}}>
            <h3>Alerts</h3>
            {alerts.map(a=> <AlertBox key={a.id} id={a.id} onDismiss={remove}>{a.msg}</AlertBox>)}
          </div>
        </section>
      </main>
    </div>
  )
}
