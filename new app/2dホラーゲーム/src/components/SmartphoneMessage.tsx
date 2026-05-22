import type { Expression } from '../game/types';
import { GlitchText } from './GlitchText';

interface SmartphoneMessageProps {
  sender: string;
  text: string;
  expression?: Expression;
}

export function SmartphoneMessage({ sender, text, expression = 'neutral' }: SmartphoneMessageProps) {
  const noisy = expression === 'glitched' || expression === 'scared';
  return (
    <div className={`phone-message ${noisy ? 'phone-message-noisy' : ''}`}>
      <div className="phone-sender">{sender}</div>
      <div className="phone-bubble">
        <GlitchText text={text} active={noisy} amount={0.18} />
      </div>
      <div className="phone-time">23:58</div>
    </div>
  );
}
