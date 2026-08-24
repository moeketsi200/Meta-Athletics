import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Cube, ThrowerState, PlayerThrowState, EventEnvironment } from './components'
import { EventType } from './events/EventConfig'
import { createCube } from './factory'

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}

const uiComponent = () => (
  <UiEntity
    uiTransform={{
      width: 400,
      height: 500, // Increased height
      margin: '16px 0 8px 270px',
      padding: 4,
    }}
    uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
  >
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      uiBackground={{ color: Color4.fromHexString("#70ac76ff") }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 50,
          margin: '8px 0'
        }}
        uiBackground={{
          textureMode: 'center',
          texture: {
            src: 'images/scene-thumbnail.png',
          },
        }}
        uiText={{ value: 'SDK7', fontSize: 18 }}
      />
      
      {/* Thrower State Meters UI */}
      <UiEntity
        uiTransform={{ width: '100%', flexDirection: 'column', alignItems: 'center', margin: '4px 0' }}
      >
        <Label
          value={`Throw State: ${getThrowerStateName()}`}
          fontSize={16}
          uiTransform={{ width: '100%', height: 20 }}
        />
        <Label
          value={`Technique: ${getThrowerTechnique().toFixed(2)}`}
          fontSize={16}
          color={Color4.White()}
          uiTransform={{ width: '100%', height: 20 }}
        />
        <Label
          value={`Power: ${getThrowerPower().toFixed(1)}`}
          fontSize={16}
          color={Color4.White()}
          uiTransform={{ width: '100%', height: 20 }}
        />
        <Label
          value={`Angle: ${getThrowerAngle().toFixed(1)}`}
          fontSize={16}
          color={Color4.White()}
          uiTransform={{ width: '100%', height: 20 }}
        />
      </UiEntity>

      <Label
        onMouseDown={() => {console.log('Player Position clicked !')}}
        value={`Player: ${getPlayerPosition()}`}
        fontSize={18}
        uiTransform={{ width: '100%', height: 30 } }
      />
      
      <Button
        uiTransform={{ width: 200, height: 30, margin: 2 }}
        value='Start Javelin Test'
        variant='primary'
        fontSize={14}
        onMouseDown={() => {
          console.log('Starting Javelin Event...')
          ThrowerState.createOrReplace(engine.PlayerEntity, {
            state: PlayerThrowState.IDLE,
            currentEvent: EventType.JAVELIN,
            power: 0,
            angle: 0,
            technique: 0,
            techniqueSum: 0,
            clickCount: 0,
            startTime: 0,
            throwId: 'javelin-test-1'
          })
          
          const envEntity = engine.addEntity()
          EventEnvironment.createOrReplace(envEntity, {
            foulLineZ: 10,
            circleCenter: Vector3.create(8, 0, 8),
            circleRadius: 0
          })
          
          console.log('Press [E] (Primary) to start Windup!')
        }}
      />

      <Button
        uiTransform={{ width: 200, height: 30, margin: 2 }}
        value='Start Shot Put Test'
        variant='secondary'
        fontSize={14}
        onMouseDown={() => {
          console.log('Starting Shot Put Event...')
          ThrowerState.createOrReplace(engine.PlayerEntity, {
            state: PlayerThrowState.IDLE,
            currentEvent: EventType.SHOT_PUT,
            power: 0,
            angle: 0,
            technique: 0,
            techniqueSum: 0,
            clickCount: 0,
            startTime: 0,
            throwId: 'test-throw-1'
          })
          
          const envEntity = engine.addEntity()
          EventEnvironment.createOrReplace(envEntity, {
            foulLineZ: 10,
            circleCenter: Vector3.create(8, 0, 8),
            circleRadius: 1.067
          })
          
          console.log('Press [E] (Primary) to start Windup!')
        }}
      />

      <Button
        uiTransform={{ width: 200, height: 30, margin: 2 }}
        value='Start Discus Test'
        variant='primary'
        fontSize={14}
        onMouseDown={() => {
          console.log('Starting Discus Event...')
          ThrowerState.createOrReplace(engine.PlayerEntity, {
            state: PlayerThrowState.IDLE,
            currentEvent: EventType.DISCUS,
            power: 0,
            angle: 0,
            technique: 0,
            techniqueSum: 0,
            clickCount: 0,
            startTime: 0,
            throwId: 'discus-test-1'
          })
          
          const envEntity = engine.addEntity()
          EventEnvironment.createOrReplace(envEntity, {
            foulLineZ: 10,
            circleCenter: Vector3.create(8, 0, 8),
            circleRadius: 1.25
          })
          
          console.log('Press [E] (Primary) to start Windup!')
        }}
      />

      <Button
        uiTransform={{ width: 200, height: 30, margin: 2 }}
        value='Start Hammer Test'
        variant='secondary'
        fontSize={14}
        onMouseDown={() => {
          console.log('Starting Hammer Event...')
          ThrowerState.createOrReplace(engine.PlayerEntity, {
            state: PlayerThrowState.IDLE,
            currentEvent: EventType.HAMMER,
            power: 0,
            angle: 0,
            technique: 0,
            techniqueSum: 0,
            clickCount: 0,
            startTime: 0,
            throwId: 'hammer-test-1'
          })
          
          const envEntity = engine.addEntity()
          EventEnvironment.createOrReplace(envEntity, {
            foulLineZ: 10,
            circleCenter: Vector3.create(8, 0, 8),
            circleRadius: 1.067
          })
          
          console.log('Press [E] (Primary) to start Windup!')
        }}
      />
      <Label
        onMouseDown={() => {console.log('# Cubes clicked !')}}
        value={`# Cubes: ${getCubesCount()}`}
        fontSize={18}
        uiTransform={{ width: '100%', height: 30 } }
      />
      
      <Button
        uiTransform={{ width: 100, height: 40, margin: 4 }}
        value='Spawn cube'
        variant='primary'
        fontSize={14}
        onMouseDown={() => {
          createCube(1 + Math.random() * 8, Math.random() * 8, 1 + Math.random() * 8, false)
        }}
      />
     </UiEntity>
  </UiEntity>
)

function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return ' no data yet'
  const { x, y, z } = playerPosition.position
  return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

function getCubesCount() {
  let count = 0
  for (const _ of engine.getEntitiesWith(Cube)) {
    count++
  }
  return count
}

function getThrowerStateName(): string {
  const stateComp = ThrowerState.getOrNull(engine.PlayerEntity)
  if (!stateComp) return 'None'
  return PlayerThrowState[stateComp.state] || 'Unknown'
}

function getThrowerPower(): number {
  const stateComp = ThrowerState.getOrNull(engine.PlayerEntity)
  if (!stateComp) return 0
  return stateComp.power
}

function getThrowerAngle(): number {
  const stateComp = ThrowerState.getOrNull(engine.PlayerEntity)
  if (!stateComp) return 0
  return stateComp.angle
}

function getThrowerTechnique(): number {
  const stateComp = ThrowerState.getOrNull(engine.PlayerEntity)
  if (!stateComp) return 0
  return stateComp.technique
}

