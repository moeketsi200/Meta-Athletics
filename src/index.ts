// We define the empty imports so the auto-complete feature works as expected.
import {} from '@dcl/sdk/math'
import { engine } from '@dcl/sdk/ecs'

import { changeColorSystem, circularSystem } from './systems'
import { throwerStateMachineSystem, jumperStateMachineSystem } from './systems/stateMachines'
import { setupUi } from './ui'

export function main() {
  // Defining behavior. See `src/systems.ts` file.
  engine.addSystem(circularSystem)
  engine.addSystem(changeColorSystem)
  engine.addSystem(throwerStateMachineSystem)
  engine.addSystem(jumperStateMachineSystem)

  // draw UI. Here is the logic to spawn cubes.
  setupUi()
}
