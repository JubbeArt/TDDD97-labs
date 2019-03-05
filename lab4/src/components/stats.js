import React from 'react'

export default class Stats extends React.Component {
  constructor (props) {
    super()

    this.state = {
    }
  }

  componentDidMount () {
    this.drawChart('chart', [this.props.viewers, this.props.numberOfPosts, this.props.concurrentUsers])
  }

  drawChart (id, data) {
    if (!document.getElementById(id)) {
      return
    }

    const context = document.getElementById(id).getContext('2d')
    const chart = new Chart(context, {
      type: 'bar',
      data: {
        labels: ['Viewers', 'Number of posts', 'Concurrent users'],
        datasets: [{
          label: 'Live data',
          data: data,
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

  render () {
    this.drawChart('chart', [this.props.viewers, this.props.numberOfPosts, this.props.concurrentUsers])
    return (
      <div id='stats'>
        <canvas width='400' height='400' id='chart' />
      </div>
    )
  }
}
