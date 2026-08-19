# Meta-Athletics: The Virtual Stadium

**Genre:** Timing, Rhythm & Physics Sports Simulator  
**Platform:** Decentraland SDK 7  
**Scope:** 8 Track and Field Events (Throwing & Jumping)  

## 🏅 The Hook
A comprehensive virtual athletics stadium where players compete across eight field events. Distance and height are calculated via deterministic kinematic math, rather than browser physics. Players use skill-based timing, rhythm, and momentum mechanics to compete for global rankings and on-chain, verifiable world records. 

---

## 🏟️ The 8 Field Events

Meta-Athletics features two distinct physics engines, each powering four events.

### Throwing Events (Projectile Physics Engine)
* **🏹 Javelin:** Power + Release Angle
* **🥎 Shot Put:** Power + Release Angle + Technique Timing
* **🥏 Discus:** Power + Release Angle + Rotation Timing
* **🔨 Hammer Throw:** Rotational Momentum + Release Timing

### Jumping Events (Jump Physics Engine)
* **🏃 Long Jump:** Run-up Speed + Takeoff Angle + Board Timing
* **🏃 Triple Jump:** 3-Phase Rhythm (Hop, Step, Jump) + Momentum Management
* **🏃 High Jump:** Approach Speed + Takeoff Angle (Scored by Height Cleared)
* **🏃 Pole Vault:** Run-up Speed + Plant Timing + Pole Launch Timing

---

## 🏗️ Technical Architecture

### 1. Event Configuration System
Instead of hardcoding eight different games, the engine is data-driven. Every event is defined by an `EventConfig`:
* `eventType` (e.g., `JAVELIN`, `HIGH_JUMP`)
* `category` (`THROW`, `JUMP`)
* `minPower` / `maxPower` / `minAngle` / `maxAngle`
* `projectileMass` / `projectileSpeed` / `gravity`
* `foulRules` / `scoringRules`

### 2. Dual Physics Engines
* **Throwing Engine:** Uses deterministic projectile mathematics ($x(t)$ and $y(t)$) based on power, angle, and timing. 
* **Jumping Engine:** Handles player/avatar trajectory, approach speed, takeoff timing, and clearance (e.g., bar collision for high jump).

### 3. Server-Side Verification API
Client results are **not trusted blindly**. When a player completes an event, the parameters (power, angle, timing) are sent to the server.
* **`ThrowVerification`:** Server recalculates the trajectory and landing distance.
* **`JumpVerification`:** Server recalculates run-up, takeoff velocity, trajectory, and bar clearance.

### 4. Leaderboards & Player Profiles
* **Event Leaderboards:** Each of the 8 events has its own Top-10 global leaderboard.
* **Athlete Profile:** Players maintain a personal profile displaying their Personal Best in all 8 events.
* **Meta-Athletics World Ranking:** Each event grants points (e.g., decathlon scoring style). Players compete on a master leaderboard for the title of best all-around athlete.

### 5. Blockchain & Web3 (Smart Contracts)
* **`AthleticsRegistry` Smart Contract:** A single Solidity contract on a low-gas L2 (like Polygon) that supports all event types.
* **Record Structure:** `athlete`, `eventType`, `distance/height`, `timestamp`, `verificationHash`.
* **Flow:** Players only receive a wallet prompt when they officially break a globally verified world record.

---

## 🎮 The Gameplay Loop

1. **The Hub:** Player enters the central Decentraland stadium and views the Meta-Athletics World Rankings.
2. **Event Selection:** Player walks to a specific event station (e.g., Pole Vault) and presses `E`.
3. **Execution:** Player completes the event-specific skill mini-game (power meters, timing clicks, rhythm sequences).
4. **Simulation:** The determinist physics engine simulates the throw or jump.
5. **Verification:** The client calculates the score visually, while the server verifies the math in the background.
6. **Progression:** The verified score updates the player's Athlete Profile, Event Leaderboard, and Total World Ranking Points.

---

For detailed project phases and tasks, see [ROADMAP.md](ROADMAP.md).