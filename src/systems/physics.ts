import { engine, Transform, Entity } from '@dcl/sdk/ecs'
import { ProjectileComponent, ThrowerState, PlayerThrowState } from '../components'
import { Vector3 } from '@dcl/sdk/math'

type ReadonlyProjectile = ReturnType<typeof ProjectileComponent.get>

export function kinematicSystem(dt: number) {
  const projectiles = engine.getEntitiesWith(ProjectileComponent, Transform)
  const now = Date.now()

  for (const [entity, projectile, _transform] of projectiles) {
    if (!projectile.isFlying) continue
    updateProjectilePhysics(entity, projectile, now)
  }
}

function updateProjectilePhysics(entity: Entity, projectile: ReadonlyProjectile, now: number) {
  const t = (now - projectile.startTime) / 1000.0 // time in seconds

  const angleRad = projectile.angle * (Math.PI / 180)
  const v0_h = projectile.velocity * Math.cos(angleRad)
  const v0_v = projectile.velocity * Math.sin(angleRad)
  
  const displacementH = v0_h * t
  const displacementV = (v0_v * t) - (0.5 * projectile.gravity * t * t)
  
  const mutableTransform = Transform.getMutable(entity)
  
  const newPosition = Vector3.create(
    projectile.startPosition.x + (projectile.direction.x * displacementH),
    projectile.startPosition.y + displacementV,
    projectile.startPosition.z + (projectile.direction.z * displacementH)
  )
  
  mutableTransform.position = newPosition
  
  if (newPosition.y <= 0) { // Assuming ground is at y=0
    handleLanding(entity, newPosition, projectile)
  }
}

function handleLanding(entity: Entity, landingPosition: Vector3, projectile: ReadonlyProjectile) {
  const mutableTransform = Transform.getMutable(entity)
  mutableTransform.position.y = 0
  
  const mutableProj = ProjectileComponent.getMutable(entity)
  mutableProj.isFlying = false
  
  const distance = Vector3.distance(
    Vector3.create(projectile.startPosition.x, 0, projectile.startPosition.z),
    Vector3.create(landingPosition.x, 0, landingPosition.z)
  )
  console.log(`KinematicSystem: Projectile landed! Distance: ${distance.toFixed(2)}m`)
  
  updatePlayerStateToResult()
}

function updatePlayerStateToResult() {
  const playerEntity = engine.PlayerEntity
  if (!ThrowerState.has(playerEntity)) return
  
  const playerState = ThrowerState.getMutable(playerEntity)
  if (playerState.state === PlayerThrowState.THROWING) {
    playerState.state = PlayerThrowState.RESULT
    console.log('Thrower: Transition to RESULT')
  }
}
