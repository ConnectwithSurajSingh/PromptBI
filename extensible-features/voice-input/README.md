## Voice Input (Extensible Feature)

Adds a microphone button to the natural-language query input.

### Behavior
- Clicking **Start** requests microphone permission (browser prompt).
- While listening, speech is transcribed into text and appended to the query.
- Clicking **Stop** stops listening.

### Notes
- Uses the Web Speech API (`SpeechRecognition`) when available.
- If unsupported or permission is denied, the UI surfaces a clear error.

