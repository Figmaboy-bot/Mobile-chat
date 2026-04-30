import { Composition } from 'remotion'
import { ChatRecording } from './ChatRecording'

export const Root = () => (
  <Composition
    id="ChatDemo"
    component={ChatRecording}
    durationInFrames={390}
    fps={30}
    width={430}
    height={932}
  />
)
