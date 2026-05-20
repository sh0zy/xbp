import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { ChipSelector } from '../components/ChipSelector'
import type { FocusEnvironment, TaskType, Location, NoiseLevel, SleepState, MotivationLevel, PhoneRisk } from '../types'
import { TASK_TYPE_LABELS, LOCATION_LABELS, NOISE_LABELS, SLEEP_LABELS, PHONE_RISK_LABELS } from '../types'
import { ArrowLeft, Play } from 'lucide-react'

type Step = 'task' | 'location' | 'noise' | 'condition' | 'duration'

const STEPS: Step[] = ['task', 'location', 'noise', 'condition', 'duration']
const STEP_LABELS: Record<Step, string> = {
  task: 'タスク種別',
  location: '場所',
  noise: '音環境',
  condition: 'コンディション',
  duration: '予定時間',
}

export function SessionSetup() {
  const navigate = useNavigate()
  const sessions = useAppStore((s) => s.sessions)
  const startSession = useAppStore((s) => s.startSession)

  const lastEnv = sessions.length > 0 ? sessions[sessions.length - 1] : null

  const [stepIdx, setStepIdx] = useState(0)
  const [env, setEnv] = useState<FocusEnvironment>({
    taskType: lastEnv?.taskType ?? 'study',
    location: lastEnv?.location ?? 'home_desk',
    noiseLevel: lastEnv?.noiseLevel ?? 'quiet',
    sleepState: lastEnv?.sleepState ?? 'normal',
    motivationLevel: (lastEnv?.motivationLevel ?? 3) as MotivationLevel,
    phoneRisk: lastEnv?.phoneRisk ?? 'medium',
    plannedDuration: lastEnv?.plannedDuration ?? 60,
  })

  const step = STEPS[stepIdx]
  const isLast = stepIdx === STEPS.length - 1

  function handleNext() {
    if (isLast) {
      startSession(env)
      navigate('/session')
    } else {
      setStepIdx(stepIdx + 1)
    }
  }

  function handleBack() {
    if (stepIdx === 0) navigate(-1)
    else setStepIdx(stepIdx - 1)
  }

  function update<K extends keyof FocusEnvironment>(key: K, val: FocusEnvironment[K]) {
    setEnv((e) => ({ ...e, [key]: val }))
  }

  const taskOptions = (Object.keys(TASK_TYPE_LABELS) as TaskType[]).map((k) => ({ value: k, label: TASK_TYPE_LABELS[k] }))
  const locationOptions = (Object.keys(LOCATION_LABELS) as Location[]).map((k) => ({ value: k, label: LOCATION_LABELS[k] }))
  const noiseOptions = (Object.keys(NOISE_LABELS) as NoiseLevel[]).map((k) => ({ value: k, label: NOISE_LABELS[k] }))
  const sleepOptions = (Object.keys(SLEEP_LABELS) as SleepState[]).map((k) => ({ value: k, label: SLEEP_LABELS[k] }))
  const phoneOptions = (Object.keys(PHONE_RISK_LABELS) as PhoneRisk[]).map((k) => ({ value: k, label: PHONE_RISK_LABELS[k] }))
  const motivOptions: { value: MotivationLevel; label: string }[] = [
    { value: 1, label: '低い' },
    { value: 2, label: 'やや低い' },
    { value: 3, label: '普通' },
    { value: 4, label: 'やや高い' },
    { value: 5, label: '高い' },
  ]
  const durationOptions: { value: number; label: string }[] = [
    { value: 15, label: '15分' },
    { value: 25, label: '25分' },
    { value: 45, label: '45分' },
    { value: 60, label: '1時間' },
    { value: 90, label: '90分' },
    { value: 120, label: '2時間' },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={handleBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <p style={{ color: '#64748b', fontSize: 12 }}>
            {stepIdx + 1} / {STEPS.length}
          </p>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
            {STEP_LABELS[step]}
          </h2>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: '#1e293b', borderRadius: 2 }}>
        <div
          style={{
            height: '100%',
            borderRadius: 2,
            background: '#38bdf8',
            width: `${((stepIdx + 1) / STEPS.length) * 100}%`,
            transition: 'width 0.3s',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }} className="scrollable">
        {step === 'task' && (
          <ChipSelector<TaskType> options={taskOptions} value={env.taskType} onChange={(v) => update('taskType', v)} />
        )}
        {step === 'location' && (
          <ChipSelector<Location> options={locationOptions} value={env.location} onChange={(v) => update('location', v)} />
        )}
        {step === 'noise' && (
          <ChipSelector<NoiseLevel> options={noiseOptions} value={env.noiseLevel} onChange={(v) => update('noiseLevel', v)} />
        )}
        {step === 'condition' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 10 }}>睡眠状態</p>
              <ChipSelector<SleepState> options={sleepOptions} value={env.sleepState} onChange={(v) => update('sleepState', v)} />
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 10 }}>やる気</p>
              <ChipSelector<MotivationLevel> options={motivOptions} value={env.motivationLevel} onChange={(v) => update('motivationLevel', v)} />
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 10 }}>スマホ誘惑リスク</p>
              <ChipSelector<PhoneRisk> options={phoneOptions} value={env.phoneRisk} onChange={(v) => update('phoneRisk', v)} />
            </div>
          </div>
        )}
        {step === 'duration' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {durationOptions.map((opt) => {
              const active = opt.value === env.plannedDuration
              return (
                <button
                  key={opt.value}
                  onClick={() => update('plannedDuration', opt.value)}
                  style={{
                    padding: '14px 20px',
                    borderRadius: 14,
                    border: `1.5px solid ${active ? '#38bdf8' : '#334155'}`,
                    background: active ? 'rgba(56,189,248,0.15)' : '#1e293b',
                    color: active ? '#38bdf8' : '#94a3b8',
                    fontWeight: active ? 700 : 400,
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={handleNext}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 14,
          background: isLast ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : '#1e293b',
          color: isLast ? '#fff' : '#38bdf8',
          fontWeight: 700,
          fontSize: 16,
          border: isLast ? 'none' : '1.5px solid #38bdf8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {isLast ? <><Play size={18} fill="white" /> セッション開始</> : '次へ'}
      </button>
    </div>
  )
}
