# Meta-Athletics Development Roadmap & To-Do List

This roadmap details the expanded 6-phase plan for building the complete Meta-Athletics Stadium (8 Events).
The core philosophy remains: **Fun → Physics → Verification → Multiplayer → Blockchain → Polish.**

---

## 📝 Phase 1: The Core Engine
**Goal:** Build the reusable architecture, ECS state, and data-driven event configuration.

- [x] Set up a local SDK 7 project using the Creator Hub.
- [ ] Create the `EventConfig` data structures.
- [ ] Implement the `ThrowerState`/`JumperState` state machines.
- [ ] Build the base `KinematicSystem` (Throwing Physics Engine).
- [ ] Build the base `JumpPhysicsSystem` (Jumping Physics Engine).
- [ ] Write the universal `FoulSystem` capable of reading different event rules.

## 📝 Phase 2: Throwing Events
**Goal:** Implement the 4 throwing events using the Throwing Physics Engine.

- [ ] **Javelin:** Implement base power/angle meters.
- [ ] **Shot Put:** Add the technique timing window.
- [ ] **Discus:** Add rotation timing mechanics.
- [ ] **Hammer:** Implement rotational momentum building (multiple timing clicks).
- [ ] Ensure all 4 events are fully playable locally with accurate physics.

## 📝 Phase 3: Jumping Events
**Goal:** Implement the 4 jumping events using the Jumping Physics Engine.

- [ ] **Long Jump:** Implement run-up speed building and takeoff board timing.
- [ ] **Triple Jump:** Implement the 3-phase rhythm (Hop, Step, Jump).
- [ ] **High Jump:** Change scoring to height cleared and implement bar collision physics.
- [ ] **Pole Vault:** Implement plant timing and pole launch mechanics.
- [ ] Ensure all 4 jumping events are fully playable locally.

## 📝 Phase 4: Multiplayer & Verification
**Goal:** Secure the game and enable global competition across all 8 events.

- [ ] Set up the backend authoritative server.
- [ ] Build `ThrowVerification` (server-side trajectory recalculation).
- [ ] Build `JumpVerification` (server-side run-up/takeoff/clearance recalculation).
- [ ] Implement 8 distinct event leaderboards on the server.
- [ ] Sync leaderboards to the Decentraland scene.

## 📝 Phase 5: Web3 & Blockchain
**Goal:** Implement the universal registry for official world records.

- [ ] Write the `AthleticsRegistry` Solidity smart contract (supporting all `eventType`s).
- [ ] Deploy to a low-gas L2 testnet (e.g., Polygon).
- [ ] Integrate ethers.js and Decentraland SDK wallet prompts.
- [ ] Trigger wallet signatures only for breaking verified world records.
- [ ] Fetch and display on-chain records in the stadium hub.

## 📝 Phase 6: Presentation & Progression
**Goal:** Polish the game into a premium experience and add the meta-game.

- [ ] Build the central stadium hub with event stations.
- [ ] Implement the **Athlete Profile** UI showing PBs across all 8 events.
- [ ] Implement the **Meta-Athletics World Ranking** (point calculation per event).
- [ ] Add 3D models (javelin, discus, high jump bar, etc.).
- [ ] Add animations, particle effects, and sound effects for each event.
- [ ] Add camera transitions (e.g., following the hammer, panning up for pole vault).

---

## ✅ Definition of "Done"
The Virtual Stadium is complete when a player can:
1. [ ] Walk into the central hub and view the World Ranking and On-Chain Records.
2. [ ] Choose between any of the 8 Throwing or Jumping events.
3. [ ] Experience distinct skill-based timing/rhythm mechanics for each event.
4. [ ] Have their score calculated deterministically and verified securely by the server.
5. [ ] View their updated Athlete Profile with points contributing to their World Rank.
6. [ ] Receive a wallet prompt if they break an overall World Record.
7. [ ] Have a seamless, lag-free experience where the gameplay is fun regardless of the blockchain elements.
