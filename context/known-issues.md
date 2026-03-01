# Known Issues

## Active

### KI-001: No responsive/mobile layout
- **Severity**: Medium
- **Description**: Fixed 256px sidebar overflows on screens < 768px. No hamburger menu.
- **Workaround**: Use desktop browser.

### KI-002: No dark mode
- **Severity**: Low
- **Description**: All colors are hardcoded light theme.

### KI-003: Chart re-renders on every slider tick
- **Severity**: Low (performance)
- **Description**: Slider drag recalculates 1000-point arrays per tick. Slight jank on low-end devices.
- **Mitigation**: useMemo is in place; could add requestAnimationFrame debouncing.

### KI-004: API key in localStorage
- **Severity**: Low (security)
- **Description**: Gemini API key stored in plain text. Acceptable for student tool; no backend to proxy through.

### KI-005: No progress tracking persistence
- **Severity**: Low
- **Description**: Sidebar learning path stepper shows current page but doesn't persist visited pages across sessions.

### KI-006: No input validation for L=0 or C=0
- **Severity**: Low
- **Description**: Passing L=0 or C=0 to circuitSolver would produce NaN (division by zero in omega0 calculation). UI sliders prevent this via min values, but the solver itself doesn't guard.

### KI-007: No error distinction in AI Tutor
- **Severity**: Low
- **Description**: AiTutor catch block shows generic error. Doesn't distinguish invalid API key vs rate limit vs network failure.

## Resolved
(None yet)
