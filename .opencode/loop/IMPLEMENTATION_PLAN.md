# Implementation Plan

## Current Recovery Strategy

The current runtime bugs are caused by split state authority, not by XState itself.
Discrete interaction and orchestration are currently spread across XState machines,
React effects, mutable module stores, and duplicated config. The active recovery path
is to make XState authoritative for room traversal and interaction flow while keeping
per-frame R3F/Rapier state outside XState.

### Working Rules
- XState owns finite workflow, transition metadata, guards, and interaction authority.
- R3F/Rapier own per-frame transforms, rigid-body movement, camera lerp, and animation blending.
- Shared actor consumption should prefer `createActorContext` and `useSelector` over broad snapshot passing.
- Callback or promise actors should replace ad hoc listener/timer orchestration only when they reduce bugs or simplify ownership.

### Branching and Delivery
- `fix/world-interaction-foundation` has already landed as the baseline.
- `fix/w4h-machine-authoritative-interaction` is merged via PR #51.
- The next implementation work should start from updated `develop` on a fresh branch dedicated to `W4h-4`.
- The interaction stability work is complete; the next focus is narrower XState React consumption cleanup.

### Active Phases
1. Phase 1: interaction stability and machine-authoritative traversal. Completed and merged.
2. Phase 2: XState React runtime consumption cleanup for touched dungeon flows. Next active phase.
3. Phase 3: selective actor-model follow-up where the payoff is clear.

### Non-Negotiable Constants Discipline
- The next implementation session must start with a touched-scope audit for magic strings and magic numbers.
- Raw room IDs, door sides, event names, machine IDs, state labels, guard keys, action keys, storage keys, copy strings, and timeout values must use config constants when they are finite and named.
- For XState setup and machine configs, string-valued `type:` references for named guards and actions should use exported config constants rather than inline string literals.
- If a constant does not exist yet and the value is domain-significant or reused, create one before continuing implementation.
- The only acceptable inline literals are trivial values already allowed by project rules, such as `0`, `1`, `-1`, and obviously structural property names.

## Priority Queue

### Item: W4h-0 Constants Discipline Audit
- Type: refactor
- Intent: Remove magic strings and numbers from the touched implementation scope before continuing the machine-authoritative interaction work.
- Scope:
  - Audit dungeon, navigation, game-canvas, and directly related tests for inline domain literals
  - Replace inline XState machine string keys with exported config constants where practical
  - Replace inline room IDs, door sides, event names, timeout values, and copy strings with named constants
- Constraints:
  - Start with the active interaction scope; do not attempt an unbounded whole-repo rewrite in one pass
  - Follow existing config naming conventions and segment purity rules
  - TDD for any lib or model helper introduced while extracting constants
- Out of scope:
  - Purely cosmetic literals with no domain meaning
  - Per-frame math values that are already intentionally localized and not domain constants
- Acceptance Criteria:
  - [x] No remaining avoidable magic strings or numbers in the touched interaction scope
  - [x] XState machine config in touched files uses named constants for reusable string keys
  - [x] All touched tests use config constants for domain values where available
- Verification:
  - Tests: all touched tests pass
  - Review: grep and code review of touched scope for remaining domain literals
- Status: done
- Evidence Ref: V33

### Item: W4a Interaction Resolver + Spatial Detection
- Type: feature
- Intent: Create a pure resolver that identifies the nearest interactable world object (door, key, exit) and nearest enemy based on player position.
- Scope:
  - One resolver function in lib/ that returns interact candidate and attack candidate
  - Resolver runs on position update (reuses playerPositionStore subscription)
  - Candidate types: door (with guard status), key (treasure key), exit (floor exit), enemy
  - Priority: key > guarded door > unguarded door > exit
  - Attack candidate detected when enemy is within ATTACK_RADIUS
- Constraints:
  - Resolver is a pure function in lib/ (TDD required)
  - Must not use frame-driven polling (reuse position store subscription)
  - Must not introduce new physics colliders (use distance checks)
  - Both candidates computed in same resolver call
- Out of scope:
  - Item collection (health/score runes)
  - Interaction animations
  - NPC interaction
- Acceptance Criteria:
  - [x] Resolver identifies treasure key when player is within interaction radius
  - [x] Resolver identifies guarded door when player is near and key is held
  - [x] Resolver identifies nearest enemy within attack radius
  - [x] Resolver returns null candidates when nothing nearby
  - [x] Priority ordering: key beats door, guarded beats unguarded
  - [x] Interact and attack candidates are independent (both can exist)
- Verification:
  - Tests: `src/features/dungeon-navigation/lib/interactionResolver.test.ts` (15 tests)
  - Runtime: walk near key, doors, exit, enemy
- Status: done
- Evidence Ref: V20

### Item: W4b Interaction Prompt UI
- Type: feature
- Intent: Show contextual prompts when the player is near interactable world objects or enemies.
- Scope:
  - Prompt component renders "Press F — [action]" when interact candidate exists
  - Prompt component renders "Press E — Attack" when attack candidate exists
  - Both prompts shown simultaneously when both candidates exist
  - Prompts disappear when no candidate is nearby
  - Themed to match dark gothic HUD
- Constraints:
  - Prompt text from config constants (no magic strings)
  - Prompts are pointer-events: none (don't block game input)
  - Must not affect performance
- Out of scope:
  - Interaction animations
  - Haptic feedback on prompt appearance
- Acceptance Criteria:
  - [x] "Press F — Pick Up Key" appears when near treasure key
  - [x] "Press F — Enter Treasury" appears when near guarded door
  - [x] "Press F — Exit Floor" appears when near exit door
  - [x] "Press E — Attack" appears when near enemy
  - [x] Both prompts shown when key and enemy are nearby
  - [x] Prompts disappear when player moves away
- Verification:
  - Tests: `src/pages/game/ui/GamePage.test.tsx` passes
  - Runtime: walk near key, doors, exit, enemy
- Status: done
- Evidence Ref: V20

### Item: W4c-i F Key — Interaction Dispatch
- Type: feature
- Intent: Wire F key to dispatch interaction events when an interact candidate exists.
- Scope:
  - F key dispatches interaction events when interact candidate exists
  - Key pickup dispatches DUNGEON_EVENTS.PICK_UP_KEY
  - Guarded door dispatches appropriate doorway event (requires explicit F press)
  - Exit dispatches exit event
  - Sidebar "Pick Up Key" button removed
- Constraints:
  - F key binding configurable via config constant
  - Must handle key repeat (debounce with cooldown)
  - Must work in all camera modes including first-person
- Out of scope:
  - Attack dispatch (separate item W4c-ii)
  - Interaction animations
- Acceptance Criteria:
  - [x] F key picks up treasure key when near it
  - [x] F key opens guarded treasury door when conditions are met
  - [x] Sidebar "Pick Up Key" button is removed
  - [x] F key does nothing when no interactable is nearby
- Verification:
  - Tests: `src/features/dungeon-navigation/lib/interactionResolver.test.ts`
  - Runtime: press F near key, press F near guarded door
- Status: done
- Evidence Ref: V20

### Item: W4c-ii E Key — Attack Dispatch
- Type: feature
- Intent: Wire E key to send damage to the nearest enemy when within attack radius.
- Scope:
  - E key dispatches ENEMY_DIED to dungeon machine
  - Attack respects ATTACK_COOLDOWN_MS (1200ms) — can't spam
  - Sidebar "Defeat Enemy" button removed
  - Player can attack from ANY camera mode
- Constraints:
  - E key binding configurable via config constant
  - Must handle key repeat (debounce with ATTACK_COOLDOWN_MS)
- Out of scope:
  - Player attack animation
  - Combo system
- Acceptance Criteria:
  - [x] E key damages nearest enemy when within attack radius
  - [x] Attack can't be spammed faster than cooldown
  - [x] Sidebar "Defeat Enemy" button is removed
- Verification:
  - Tests: wired to existing enemy machine
  - Runtime: press E near enemy
- Status: done
- Evidence Ref: V20

### Item: W4e Door Auto-Trigger Removal
- Type: bugfix
- Intent: Remove auto-trigger behavior from ALL doorway proximity. Every door interaction now requires the F key, consistent with video game UX.
- Scope:
  - Stop useDoorwayNavigation from auto-dispatching doorway events
  - Include ALL doors (unguarded and guarded) as interact candidates in the resolver
  - F key dispatches doorway events for all door types
- Constraints:
  - Doorway proximity detection still works (hooks into resolveDoorwayNavigationEvent)
  - Locked door feedback still fires when F is pressed on a locked door
  - Must not break doorway arrival positioning
  - Must not create a situation where the player can't enter a room
- Out of scope:
  - Door animations
  - Sound effects for door opening
- Acceptance Criteria:
  - [x] Walking through an unguarded door no longer auto-triggers room transition
  - [x] "Press F — Enter Library" appears when near an unguarded door
  - [x] F key is required to enter ALL rooms (unguarded and guarded)
  - [x] Locked door feedback still fires when pressing F on a locked door
  - [x] Player can still navigate between rooms via F key
- Verification:
  - Tests: `src/features/dungeon-navigation/model/useDoorwayNavigation.test.ts` (4 tests)
  - Runtime: walk toward every door, confirm no auto-transition, press F to enter
- Status: done
- Evidence Ref: V22

### Item: W4f World-Space Interaction Prompts
- Type: bugfix
- Intent: Move interaction prompts from fixed HUD position to world-space near the interactable object, matching video game conventions.
- Scope:
  - Replace fixed-position HUD prompt with drei Html projected prompts inside R3F Canvas
  - Door prompts appear at the doorway edge (where the player sees the door)
  - Key prompts appear above the treasure key mesh
  - Enemy prompts appear above the nearest enemy
  - Prompts work across all camera modes
- Constraints:
  - Uses drei Html (project already uses drei for room labels)
  - Prompt text from config constants (no magic strings)
  - pointer-events: none on the HTML element
  - distanceFactor set to prevent clipping at close range
  - Must not overlap with camera mode switcher or HUD
  - Performance: 2-3 prompts max at any time
  - Inline styles must use CSS variables (theme token compliance)
- Out of scope:
  - Prompt animations (fade in/out)
  - Multi-prompt stacking logic
- Acceptance Criteria:
  - [x] Door prompt appears at/near the doorway when the player is near
  - [x] Key prompt appears above the treasure key when the player is near
  - [x] Enemy prompt appears above the nearest enemy when the player is near
  - [x] Prompts follow the camera in all modes
  - [x] Prompts do not overlap with camera switcher or HUD
  - [x] Prompts disappear when the player moves away
- Verification:
  - Tests: `src/widgets/game-canvas/ui/WorldInteractionPrompt.tsx` renders correctly
  - Runtime: walk near each interactable in each camera mode
- Status: done
- Evidence Ref: V22

### Item: W4g Doorway Physics Colliders for All Doors
- Type: bugfix
- Intent: Every doorway must physically block the player until they explicitly interact with F.
- Scope:
  - Add physics collider at every doorway opening (not just guarded doors)
  - Create doorOpenStore to track which doors have been opened
  - Collider is removed when door is opened (F key pressed on unlocked door)
  - Invisible collider for unguarded doors (no visual gate mesh)
  - Visible gate mesh for guarded doors (existing behavior)
  - Increase INTERACTION_RADIUS from 1.5 to 2.5 so player can reach past collider
- Constraints:
  - Collider uses existing DOORWAY_GATE dimensions for guarded doors
  - Door open state tracked per-room (ephemeral, resets when dungeon restarts)
  - Must not block corridor entry (colliders only at room doorways)
  - F key marks door as opened BEFORE dispatching transition event
  - doorOpenStore must not import from @/entities/dungeon (FSD compliance)
- Out of scope:
  - Door opening animations
  - Sound effects for door opening
  - Persistent door state across runs (will be addressed in W4h)
- Acceptance Criteria:
  - [x] Player cannot walk through unguarded doors without pressing F
  - [x] "Press F — Enter Library" appears when near unguarded door
  - [x] Player can walk through after pressing F
  - [x] Locked guarded doors still block (existing behavior)
  - [x] Unlocked guarded doors block until F is pressed
  - [x] Collider is removed on same frame as room transition
  - [x] All existing tests pass (32 tests, 7 new doorOpenStore tests)
- Verification:
  - Tests: `src/entities/room/lib/doorOpenStore.test.ts` (7 tests)
  - Runtime: walk toward every door, confirm blocked until F pressed
- Status: done
- Evidence Ref: V23
- Known issues (deferred to W4h):
  - Teleport sometimes goes to room center instead of doorway
  - Key pickup prompt always present in guard room (no proximity check)
  - Doors stay open after completing machine and returning
  - Prompt positions not at actual interactable locations

### Item: W4h-1 Machine-Authoritative Door Traversal
- Type: refactor
- Intent: Make the dungeon machine the single source of truth for room traversal while preserving R3F/Rapier performance boundaries.
- Scope:
  - Remove traversal dependency on persistent `openedDoors` and `OPEN_DOOR`
  - Require `F` for every room traversal
  - Guard traversal on `nearInteractable` plus domain guards
  - Keep doorway colliders always blocking; traversal happens by transition plus teleport
  - Centralize shared interaction events at the machine root where practical
- Constraints:
  - Use XState v5 guard objects with params
  - Use composable guards where it improves clarity
  - Keep per-frame physics and raw world position updates outside XState
  - No new mutable module store for door state
  - TDD for `model/` and `lib/`
- Out of scope:
  - Door animation
  - Sound redesign
  - Combat redesign
- Acceptance Criteria:
  - [x] F is required for every room traversal
  - [x] Doors re-block automatically after every transition
  - [x] No persistent door-open traversal state remains
  - [x] All room transitions are machine-guarded on proximity and domain rules
  - [x] Existing door-glide behavior is eliminated
  - [x] `npm run ci:preflight` passes
- Verification:
  - Tests: dungeon machine transition tests, interaction flow tests
  - Runtime: full traversal across all rooms, including backtracking
- Status: done
- Evidence Ref: V33

### Item: W4h-2 Transition Metadata and Doorway Arrival
- Type: bugfix
- Intent: Make doorway-relative arrival deterministic by using machine-owned transition metadata instead of previous-room heuristics.
- Scope:
  - Write `lastTransition` on every successful room transition
  - Use `lastTransition` for player teleport target selection
  - Remove previous-room heuristic as the authority for arrival placement
- Constraints:
  - Machine remains source of truth for transition metadata
  - Keep actual rigid-body teleport in the player and scene integration layer
  - TDD for affected `model/` and `lib/`
- Out of scope:
  - Camera transition animation redesign
- Acceptance Criteria:
  - [x] Player arrives just inside the matching doorway in the destination room
  - [x] Arrival resolves from the canonical destination doorway anchor, not room-center math
  - [x] Arrival no longer falls back to room center during normal transitions
  - [x] Backtracking arrivals are also doorway-correct
- Verification:
  - Tests: transition metadata tests, doorway arrival tests, side-effects tests
  - Runtime: forward path and return path through all connected rooms
- Status: done
- Evidence Ref: V36
- Follow-up Note:
  - V33 proved `lastTransition` wiring is present, but runtime behavior still shows some transitions arriving at room center instead of the destination doorway.

### Item: W4h-3 Proximity-Gated Key and Interactable Anchors
- Type: bugfix
- Intent: Ensure prompts and F interactions resolve from actual interactable locations.
- Scope:
  - Gate key pickup by actual proximity
  - Anchor door prompts to door world positions
  - Anchor key prompt to key world position
  - Anchor enemy prompt to nearest live enemy runtime position
  - Remove room-center prompt placement as the interaction authority
  - Lower door prompt anchor to doorway midpoint so first-person view can read it naturally
- Constraints:
  - No frame-driven React state churn beyond what is necessary
  - Prompt rendering must remain pointer-pass-through
  - TDD for resolver and anchor mapping logic
- Out of scope:
  - Prompt animation polish
- Acceptance Criteria:
  - [x] Key prompt appears only when near the key
  - [x] Door prompts appear at the relevant doorway, not room center, and stay readable in first-person without looking up
  - [x] Enemy prompt and attack availability track the nearest live enemy target, not the room-center spawn approximation
  - [x] Prompt and action targets remain consistent
- Verification:
  - Tests: interaction resolver tests, prompt anchor mapping tests
  - Runtime: guard room key pickup, door traversal, enemy interaction
- Status: done
- Evidence Ref: V36
- Follow-up Note:
  - V33 fixed key and door/key anchor ownership, but runtime feedback shows enemy targeting still follows static spawn approximations and door prompt height is too high for first-person readability.

### Item: W4h-4 XState React Runtime Consumption Cleanup
- Type: refactor
- Intent: Reduce rerender noise and snapshot-wide coupling by adopting XState React patterns for shared actors.
- Scope:
  - Replace broad custom runtime snapshot consumption with `createActorContext` and `useSelector` for touched dungeon-related consumers
  - Prefer actor refs over passing full snapshots through custom context
- Constraints:
  - Keep scope limited to touched dungeon-related runtime consumers in this cycle unless expansion is low-risk
  - Do not move per-frame 3D math into XState
- Out of scope:
  - Full app-wide actor-system rewrite
- Acceptance Criteria:
  - [x] Touched consumers subscribe to selected machine state instead of full snapshots
  - [x] No behavior regression in HUD, prompts, side effects, or inspector inputs
- Verification:
  - Tests: touched hook and provider tests
  - Runtime: dungeon HUD, prompt, transition flow
- Status: done
- Evidence Ref: V38

### Item: W4h-5 Actor-Model Follow-Up Opportunities
- Type: improvement
- Intent: Expand XState usage where it clearly replaces imperative orchestration without overengineering.
- Scope:
  - Evaluate enemy attack cadence in-machine
  - Evaluate callback actors for keyboard and pointer-lock bridges
  - Evaluate inspection-derived or machine-derived visualizer data
- Constraints:
  - Only take items with clear payoff after W4h-1 through W4h-4 are green
  - Keep per-frame physics, rigid-body transforms, and camera lerp outside XState
- Out of scope:
  - Moving raw per-frame world state into XState
- Acceptance Criteria:
  - [ ] Selected follow-up item has a clear bug-reduction or observability payoff
- Verification:
  - Tests and runtime checks scoped to the chosen follow-up
- Status: pending
- Evidence Ref:

### Item: W4k Free-Orbital Runtime Stability
- Type: bugfix
- Intent: Remove the visible free-orbital hitch during room-to-room traversal without reopening the machine-authority work that just merged.
- Scope:
  - Profile and narrow the free-orbital recenter path in `useCameraRigViewModel`
  - Remove duplicate movement-driven interaction-candidate consumption where it clearly reduces runtime churn
  - Validate whether world-space prompt projection amplifies the hitch while the camera is moving
- Constraints:
  - Keep per-frame camera lerp and physics outside XState
  - Do not alter doorway semantics, arrival placement, or non-free-orbital camera modes unless required for a regression fix
- Out of scope:
  - Prompt sizing polish
  - Character facing polish
- Acceptance Criteria:
  - [x] Free-orbital traversal no longer shows visible hitching while the camera recenters after doorway transitions
  - [x] Third-person, top-down, and first-person behavior remain unchanged
  - [x] Prompt targeting and doorway transitions remain correct
- Verification:
  - Tests: targeted camera-rig, interaction, and game-canvas runtime tests
  - Runtime: traverse room A -> B and B -> A in camera mode `4`, including movement during the camera catch-up window
- Status: done
- Evidence Ref: V42

### Delivery Phases
- Phase 0: baseline branch has already been merged.
- Phase 1: W4h-1 through W4h-3 landed via PR #51 and are merged.
- Phase 2: W4h-4 landed via PR #52 and is merged.
- Phase 3: `W4k Free-Orbital Runtime Stability` landed via PR #53 and is merged.
- Phase 4: implement `W4o Third-Person Transition Stability` from fresh `develop`.
- Phase 5: after W4o review/merge, return to prompt legibility, character facing, and broader actor-model follow-up work.

### Deferred Backlog

### Item: W4o Third-Person Transition Stability
- Type: bugfix
- Intent: Keep the player and destination room visible in third-person after doorway transitions instead of preserving an obstructed orbit from the previous room.
- Scope:
  - Detect third-person room-transition-sized jumps in `useCameraRigViewModel`
  - Reset to doorway-aware third-person framing on transition-sized jumps instead of preserving the prior obstructed orbit
  - Clamp the temporary arrival-side setback so movement continuity is preserved without pushing the camera into doorway geometry
- Constraints:
  - Preserve ordinary third-person orbit behavior during non-transition movement
  - Do not change free-orbital, top-down, or first-person behavior
- Acceptance Criteria:
  - [x] Third-person camera no longer lands behind walls or doorways after room transitions
  - [x] The player remains visible and the destination room stays readable after entry
- Verification:
  - Tests: targeted camera-rig transition coverage
  - Runtime: traverse doorway transitions in third-person and confirm visibility in both directions
- Status: done
- Evidence Ref: V45

### Item: W4j Hint Legibility
- Type: bugfix
- Intent: Keep world-space interaction hints readable across zoom levels without breaking prompt anchoring.
- Scope:
  - Revisit `distanceFactor` usage for world prompts
  - Add responsive sizing for prompt shell and keycap treatment
- Constraints:
  - Preserve the prompt anchor work merged in Phase 1
  - Keep the solution compatible with all camera modes that display world prompts
- Acceptance Criteria:
  - [ ] Door, key, and attack prompts remain legible at near and far zoom distances
  - [ ] Prompt sizing does not overwhelm close-range views
- Verification:
  - Runtime: compare near and far zoom readability in active prompt scenarios
- Status: pending
- Evidence Ref:

### Item: W4n Character Facing Polish
- Type: improvement
- Intent: Make player and enemy visuals face their travel direction so movement reads naturally in combat and traversal.
- Scope:
  - Rotate the player visual mesh toward movement direction
  - Rotate enemy visual meshes toward patrol or chase direction
- Constraints:
  - Keep rigid-body rotations locked for physics stability
  - Keep visual yaw in render/runtime code rather than moving it into XState
- Acceptance Criteria:
  - [ ] The player visually faces travel direction during movement without idle jitter
  - [ ] Enemies visually face patrol and chase direction without breaking attack behavior
- Verification:
  - Tests: targeted mesh view-model coverage where practical
  - Runtime: player traversal and enemy patrol/chase visual checks
- Status: pending
- Evidence Ref:

### Item: W4d Shortcut Keys Legend Sidebar
- Type: feature
- Intent: Show contextual keybind hints as a collapsible left sidebar, keeping to the dark gothic theme.
- Scope:
  - Left sidebar opposite the XState inspector
  - Shows active keybinds relevant to current state
  - Collapsible with toggle button
- Constraints:
  - Sidebar state managed by XState or React state, not a new store
  - Keybind labels from config constants
  - Sidebar must not block game canvas input
- Acceptance Criteria:
  - [ ] Sidebar shows movement, interact, attack, and camera hotkeys by default
  - [ ] Sidebar collapses cleanly
  - [ ] Sidebar does not interfere with game input
- Verification:
  - Tests: all existing tests pass
- Status: pending
- Evidence Ref:

### Item: W4l Test Consistency Cleanup
- Type: refactor
- Intent: Replace remaining magic strings and numbers in tests with config constants after the interaction flow is stable.
- Scope:
  - Replace hardcoded room IDs, directions, and machine constants in tests
- Constraints:
  - Must not break any tests
- Acceptance Criteria:
  - [ ] No remaining intentional magic strings or numbers in touched tests
- Verification:
  - Tests: all existing tests pass
- Status: pending
- Evidence Ref:

### Item: W4m Dead Code Cleanup
- Type: cleanup
- Intent: Remove unused code discovered during investigation once the active interaction recovery work lands.
- Scope:
  - Delete `InteractionPrompt.tsx`
  - Delete `useCameraSystem.ts`
  - Clean up stale barrel exports
- Acceptance Criteria:
  - [ ] No imports of deleted code remain
  - [ ] All barrel files are updated
- Verification:
  - Tests: all existing tests pass
- Status: pending
- Evidence Ref:
