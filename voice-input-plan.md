# Voice Input for Mock Interview — Plan

## Top-Level Overview

Add a microphone toggle button to the answer area of the mock interview screen so users can speak their answers. The browser's built-in **Web Speech API (`SpeechRecognition`)** handles all transcription — no backend, no API keys required. Transcribed text is **appended** to whatever is already in the textarea (additive mode), allowing free mixing of typing and speaking. The mic button sits in the top-right corner of the answer area, overlaid on the textarea border. Graceful degradation is applied for unsupported browsers (Firefox).

The change touches two files:
- `pages/interview.js` — HTML template + event wiring
- `css/components.css` — mic button and recording-state styles

---

## Sub-Tasks

---

### Sub-Task 1 — Add Mic Button to Answer Area HTML

**Status:** [ ] pending

**Intent**  
Inject a microphone toggle button into the `renderInterviewScreen` template, positioned in the top-right corner of the answer textarea using CSS `position: relative / absolute` on the wrapper.

**Expected Outcomes**
- A 🎤 mic icon button appears in the top-right corner of the answer textarea at all times.
- The button carries `id="mic-btn"` so the wiring code can reference it.
- The answer textarea wrapper gets `position: relative` to anchor the absolute-positioned button.
- On unsupported browsers the button will still render but be disabled by the wiring step.

**Todo List**
1. In `renderInterviewScreen` (`pages/interview.js` ~line 238), wrap the `<textarea>` in a `<div class="answer-textarea-wrap">`.
2. Inside that wrapper, after the `<textarea>`, add a `<button id="mic-btn" class="mic-btn" title="Start voice input" aria-label="Start voice input">` containing an inline SVG microphone icon (Material Design mic SVG path). The JS wiring step will swap the SVG between idle and active states.
3. Keep the textarea's own attributes untouched.

**Relevant Context**
- Template lives in `renderInterviewScreen` at `pages/interview.js:246-248`.
- The answer area container already has class `answer-area` (see `css/components.css:499`).
- Existing pattern: `btn-bookmark` is similarly a small icon button absolutely positioned in its card header.

---

### Sub-Task 2 — Add CSS Styles for Mic Button and Recording State

**Status:** [ ] pending

**Intent**  
Style the mic button so it floats over the top-right corner of the textarea without disrupting layout. Add a `.recording` modifier class that turns the button red and applies a pulsing animation to communicate active recording.

**Expected Outcomes**
- `.answer-textarea-wrap` is `position: relative` so the absolute child is anchored correctly.
- `.mic-btn` appears as a small circular button (≈ 32×32 px) positioned top-right, with a subtle border and hover state consistent with the IBM Carbon design tokens already used.
- `.mic-btn.recording` turns the icon red (`var(--ibm-red)`) with a gentle pulse keyframe animation.
- `.mic-btn:disabled` is visually muted (opacity 0.4, cursor not-allowed).

**Todo List**
1. Append new CSS rules to `css/components.css` after the `.btn-bookmark.bookmarked` rule (after line 646):
   - `.answer-textarea-wrap` — `position: relative`
   - `.mic-btn` — absolute position (top: 8px, right: 8px), circular, neutral border, transition
   - `.mic-btn.recording` — red border/color + `@keyframes mic-pulse` animation
   - `.mic-btn:disabled` — muted opacity

**Relevant Context**
- Design tokens: `var(--ibm-red)`, `var(--ui-02)`, `var(--ui-03)`, `var(--border-radius)` are already defined in `css/main.css`.
- Existing pattern: `.interview-timer.warning { color: var(--ibm-red); }` shows how the red token is used for urgency states.

---

### Sub-Task 3 — Wire Voice Input Logic in `mountInterview`

**Status:** [ ] pending

**Intent**  
Add JavaScript event wiring in `mountInterview` (`pages/interview.js:327`) that:
1. Detects Web Speech API support and disables the button if unsupported.
2. On button click, toggles `SpeechRecognition` start/stop.
3. Appends interim and final transcripts to the answer textarea.
4. Updates the word count bar whenever new text is appended.
5. Cleans up the recognition instance when the question changes (on skip / next / prev / timer expiry).

**Expected Outcomes**
- Clicking the mic SVG icon button starts listening; button gains `.recording` class and icon changes to an active/pulsing red mic SVG.
- Speaking appends live interim text to textarea (real-time preview, slightly dimmed or in-place append).
- Clicking the active mic button stops recognition; button reverts to the idle mic SVG icon.
- Final confirmed transcript is appended to textarea, word count bar updates.
- If browser does not support `SpeechRecognition` or `webkitSpeechRecognition`, button is disabled and `title` set to "Voice input not supported in this browser".
- Recognition automatically stops and is cleaned up when navigating away from a question.

**Todo List**
1. After the `updateWordCount` wiring block (~line 377 in `pages/interview.js`), add a self-contained `initVoiceInput()` call.
2. Implement `initVoiceInput()` as a local function inside `mountInterview`:
   a. Check `window.SpeechRecognition || window.webkitSpeechRecognition`; if absent, disable button + return.
   b. Create `recognition` instance, set `continuous = true`, `interimResults = true`, `lang = 'en-US'`.
   c. Track state with a local `isRecording` boolean.
   d. On button click: if not recording → `recognition.start()`, toggle button to recording state; if recording → `recognition.stop()`.
   e. `recognition.onresult`: iterate results; accumulate all new final results since last activation into a running string and append to `answerInput.value`, call `updateWordCount()`. Interim results are shown as a live suffix that gets replaced once finalized.
   f. `recognition.onend`: always reset button to idle state, set `isRecording = false`.
   g. `recognition.onerror`: reset button, optionally call `showToast('Voice input error: ' + event.error, 'error')`.
3. Expose a `stopVoiceInput()` helper that calls `recognition.abort()` if active — call this at the top of `goToQuestion` or wherever the question navigation transitions happen, to ensure the mic stops when changing questions.

**Relevant Context**
- `mountInterview` starts at `pages/interview.js:327`. The `updateWordCount` function and its event listener are at lines 367–378.
- `answerInput` is already a local variable in `mountInterview` (line 363), available for appending.
- `showToast` is imported and used throughout `pages/interview.js` for user notifications.
- `goToQuestion` is called on skip/prev/next/timer-expiry — the cleanup hook belongs there.
- Web Speech API: `new (window.SpeechRecognition || window.webkitSpeechRecognition)()` — standard browser pattern; `continuous = true` means recognition keeps listening indefinitely across natural speech pauses until the user manually clicks stop — ideal for long interview answers.

---

## Non-Goals

- No server-side speech processing.
- No language selection UI (defaults to `en-US`).
- No audio playback or recording download.
- No changes to the scoring/evaluation logic.
- No changes to any page other than the interview screen.
