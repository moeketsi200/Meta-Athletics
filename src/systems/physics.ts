import { engine, Transform } from '@dcl/sdk/ecs'
import { ProjectileComponent, ThrowerState, PlayerThrowState } from '../components'
import { Vector3 } from '@dcl/sdk/math'

export function kinematicSystem(dt: number) {
  const projectiles = engine.getEntitiesWith(ProjectileComponent, Transform)
  const now = Date.now()

  for (const [entity, projectile, _transform] of projectiles) {
    if (!projectile.isFlying) continue

    const t = (now - projectile.startTime) / 1000.0 // time in seconds

    // Projectile equations
    // V0x = v0 * cos(angle) (horizontal velocity)
    // V0y = v0 * sin(angle) (vertical velocity)
    
    // convert angle from degrees to radians
    const angleRad = projectile.angle * (Math.PI / 180)
    
    const v0_h = projectile.velocity * Math.cos(angleRad)
    const v0_v = projectile.velocity * Math.sin(angleRad)
    
    const displacementH = v0_h * t
    const displacementV = (v0_v * t) - (0.5 * projectile.gravity * t * t)
    
    const mutableTransform = Transform.getMutable(entity)
    
    // Calculate new position based on start position, horizontal direction and vertical displacement
    const newPosition = Vector3.create(
      projectile.startPosition.x + (projectile.direction.x * displacementH),
      projectile.startPosition.y + displacementV,
      projectile.startPosition.z + (projectile.direction.z * displacementH)
    )
    
    mutableTransform.position = newPosition
    
    // Check for ground collision
    if (newPosition.y <= 0) { // Assuming ground is at y=0
       mutableTransform.position.y = 0
       const mutableProj = ProjectileComponent.getMutable(entity)
       mutableProj.isFlying = false
       
       // Calculate final horizontal distance
       const distance = Vector3.distance(
         Vector3.create(projectile.startPosition.x, 0, projectile.startPosition.z),
         Vector3.create(newPosition.x, 0, newPosition.z)
       )
       console.log(`KinematicSystem: Projectile landed! Distance: ${distance.toFixed(2)}m`)
       
       // Update player state to RESULT
       const playerEntity = engine.PlayerEntity
       if (ThrowerState.has(playerEntity)) {
         const playerState = ThrowerState.getMutable(playerEntity)
         if (playerState.state === PlayerThrowState.THROWING) {
           playerState.state = PlayerThrowState.RESULT
           console.log('Thrower: Transition to RESULT')
         }
       }
    }
  }
}
