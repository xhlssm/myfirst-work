import VoiceInput from './ui/VoiceInput';

// ...existing code...

<Input
  value={title}
  onChange={e => setTitle(e.target.value)}
  placeholder="标题"
  className="..."
/>
<VoiceInput onResult={txt => setTitle(txt)} />

// ...existing code...