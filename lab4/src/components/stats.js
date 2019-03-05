import React from 'react'

export default class Stats extends React.Component {
  constructor (props) {
    super()

    this.state = {
    }
  }

  setUpChart () {
    const context = document.getElementById('chart').getContext('2d')

    this.chart = new Chart(context, {
      type: 'bar',
      data: {
        labels: ['Viewers', 'Number of posts', 'Concurrent users'],
        datasets: [{
          label: 'Live data',
          data: [this.props.viewers, this.props.numberOfPosts, this.props.concurrentUsers],
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      }
    })
  }

  updateChart () {
    if (!this.chart) return
    // ye....
    this.chart.data.datasets[0].data = [this.props.viewers, this.props.numberOfPosts, this.props.concurrentUsers]
    this.chart.update()
  }

  componentDidMount () {
    this.setUpChart()
  }

  componentWillUnmount () {
    this.chart = null
  }

  render () {
    this.updateChart()
    return (
      <div id='stats'>
        <canvas width='400' height='400' id='chart' />
      </div>
    )
  }
}
