import React from 'react'
import { requests, getFormInput, postsToHTML, userDataToHTML } from '../helpers'

export default class Stats extends React.Component {
  constructor (props) {
    super()

    this.state = {
        usersOnline: 0,
        // numberOfPosts: [0, 1, 4, 76],
        // numberOfPosts: 50,
        // numberOfViews: 50
    }
  }

  componentDidMount() {
    console.log('mounted')


    // connection = new WebSocket('ws://localhost:5000/users_online')

    // connection.onopen = () => {
    //   console.log('awdawsasadawerwa432')
    //   connection.send(getToken())
    // }
  
    // connection.onmessage = (message) => {
    //   console.log('Got message. GET OUT!', message)
    //   removeToken()
    //   displayView()
    // }

  }

  name(params) {
    if(!document.getElementById(params)) return

    var ctx = document.getElementById(params).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        // options: {
        //     scales: {
        //         yAxes: [{
        //             ticks: {
        //                 beginAtZero:true
        //             }
        //         }]
        //     }
        // }
    });  
  }

  render () {
    this.name("myChart1")
    // this.name("myChart2")
    // this.name("myChart3")

    return (
        <div id='stats'>
            <canvas width="400" height="400" id="myChart1"></canvas>
            {/* <canvas width="400" height="400" id="myChart2"></canvas>
            <canvas width="400" height="400" id="myChart3"></canvas> */}
        </div>
    )
  }
}
