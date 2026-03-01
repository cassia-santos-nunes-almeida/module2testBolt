# Current Sprint: Project Reorganization

## Goals
1. Break monolithic components into focused sub-components (<200 lines each)
2. Deduplicate types, constants, and patterns across modules
3. Add Vitest testing for core math utilities
4. Fix Tailwind v4 configuration (remove v3-style JS config)
5. Implement Claude Code best-practices structure

## In Progress
- [ ] Extract shared types to src/types/circuit.ts
- [ ] Create useCircuitParams hook for shared simulation state
- [ ] Extract circuit UI components to src/components/circuit/
- [ ] Decompose ComponentPhysics (762 lines) into 4 focused files
- [ ] Decompose InteractiveLab (681 lines) into 4 focused files
- [ ] Decompose SDomainAnalysis (544 lines) into 6 focused files
- [ ] Decompose TimeDomain (635 lines) into 4 focused files

## Done
- [x] Deep audit completed (19 issues identified)
- [x] Reorganization plan created and approved
- [x] New repo initialized with fresh structure

## Blocked
- Nothing currently blocked
