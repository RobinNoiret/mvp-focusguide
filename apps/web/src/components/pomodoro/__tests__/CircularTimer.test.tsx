import { render, screen } from '@testing-library/react'
import { CircularTimer } from '../CircularTimer'

describe('CircularTimer', () => {
  it('displays formatted time in MM:SS', () => {
    render(
      <CircularTimer
        timeRemaining={1554} // 25:54
        totalDuration={1500}
        progressPercentage={100}
        formattedTime="25:54"
        mode="focus"
      />
    )

    // AC 4: MM:SS format
    expect(screen.getByText('25:54')).toBeInTheDocument()
  })

  it('displays current mode', () => {
    render(
      <CircularTimer
        timeRemaining={300}
        totalDuration={300}
        progressPercentage={100}
        formattedTime="05:00"
        mode="break"
      />
    )

    // AC 5: Mode label
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('displays focus mode label', () => {
    render(
      <CircularTimer
        timeRemaining={1500}
        totalDuration={1500}
        progressPercentage={100}
        formattedTime="25:00"
        mode="focus"
      />
    )

    // AC 5: Mode label for focus
    expect(screen.getByText('Focus')).toBeInTheDocument()
  })

  it('renders SVG circle with correct attributes', () => {
    const { container } = render(
      <CircularTimer
        timeRemaining={1500}
        totalDuration={1500}
        progressPercentage={100}
        formattedTime="25:00"
        mode="focus"
      />
    )

    // AC 3: SVG exists
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()

    // AC 3: Chartreuse stroke
    const progressCircle = container.querySelectorAll('circle')[1]
    expect(progressCircle).toHaveAttribute('stroke', '#D9FC00')
  })

  it('renders both background and progress circles', () => {
    const { container } = render(
      <CircularTimer
        timeRemaining={750}
        totalDuration={1500}
        progressPercentage={50}
        formattedTime="12:30"
        mode="focus"
      />
    )

    // AC 3: Two circles (background + progress)
    const circles = container.querySelectorAll('circle')
    expect(circles).toHaveLength(2)

    // Background circle
    expect(circles[0]).toHaveAttribute('stroke', '#e5e7eb')

    // Progress circle
    expect(circles[1]).toHaveAttribute('stroke', '#D9FC00')
  })

  it('calculates correct stroke-dashoffset for progress ring', () => {
    const { container } = render(
      <CircularTimer
        timeRemaining={750}
        totalDuration={1500}
        progressPercentage={50}
        formattedTime="12:30"
        mode="focus"
      />
    )

    // AC 6: Progress ring has correct offset
    const progressCircle = container.querySelectorAll('circle')[1]
    const strokeDasharray = progressCircle.getAttribute('stroke-dasharray')
    const strokeDashoffset = progressCircle.getAttribute('stroke-dashoffset')

    expect(strokeDasharray).toBeTruthy()
    expect(strokeDashoffset).toBeTruthy()

    // Offset should be approximately half of dasharray for 50% progress
    const dasharray = parseFloat(strokeDasharray || '0')
    const offset = parseFloat(strokeDashoffset || '0')
    expect(Math.abs(offset - dasharray * 0.5)).toBeLessThan(1)
  })
})
