import { engine, Transform } from '@dcl/sdk/ecs'
import { JumperPhysicsComponent, JumperState, PlayerJumpState } from '../components'
import { Vector3 } from '@dcl/sdk/math'

export function jumpPhysicsSystem(dt: number) {
  const jumpers = engine.getEntitiesWith(JumperPhysicsComponent, Transform)
  const now = Date.now()

  for (const [entity, jumper, _transform] of jumpers) {
    if (!jumper.isJumping) continue

    const t = (now - jumper.startTime) / 1000.0 // time in seconds

    // Jump equations
    const angleRad = jumper.takeoffAngle * (Math.PI / 180)
    
    const v0_h = jumper.runupSpeed * Math.cos(angleRad)
    const v0_v = jumper.runupSpeed * Math.sin(angleRad)
    
    const displacementH = v0_h * t
    const displacementV = (v0_v * t) - (0.5 * jumper.gravity * t * t)
    
    const mutableTransform = Transform.getMutable(entity)
    
    const newPosition = Vector3.create(
      jumper.startPosition.x + (jumper.direction.x * displacementH),
      jumper.startPosition.y + displacementV,
      jumper.startPosition.z + (jumper.direction.z * displacementH)
    )
    
    mutableTransform.position = newPosition
    
    // Check for landing (ground assumed at y=0, prevent immediate trigger at t=0)
    if (newPosition.y <= 0 && t > 0.1) {
       mutableTransform.position.y = 0
       const mutableJumper = JumperPhysicsComponent.getMutable(entity)
       mutableJumper.isJumping = false
       
       // Calculate final horizontal distance
       const distance = Vector3.distance(
         Vector3.create(jumper.startPosition.x, 0, jumper.startPosition.z),
         Vector3.create(newPosition.x, 0, newPosition.z)
       )
       console.log(`JumpPhysicsSystem: Jumper landed! Distance: ${distance.toFixed(2)}m`)
       
       // Update player state to RESULT
       const playerEntity = engine.PlayerEntity
       if (JumperState.has(playerEntity)) {
         const playerState = JumperState.getMutable(playerEntity)
         if (playerState.state === PlayerJumpState.FLIGHT) {
           playerState.state = PlayerJumpState.RESULT
           console.log('Jumper: Transition to RESULT')
         }
       }
    }
  }
}
