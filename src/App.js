import React from 'react';
import axios from 'axios';
import './App.css';
import moment from 'moment';


export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: {
                value: '',
                valueOld: '',
                changed: false,
            },
            weatherData: {
                sky: '',
                temp: '',
                feelsLike: '',
                press: '',
                hum: '',
                wind: ''
            },
            forecastData: {
                time: [],
                sky: [],
                temp: [],
                feelsLike: [],
                press: [],
                hum: [],
                wind: []
            }
        }
        this.appId = 'd90eae9f9ee313a6fbfc12712b4104ea';
        this.inputChange = this.inputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.checkForecast = this.checkForecast.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    
    inputChange(e){
        let next = this.state;
        next.inputValue.value = e.target.value;
        next.inputValue.changed = next.inputValue.value !== next.inputValue.valueOld;
        this.setState(next);
    }

    handleClick(){
        console.log(`Weather in ${this.state.inputValue.value}`)
        axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${this.state.inputValue.value}&appid=${this.appId}`)
            .then(res => {
                console.log(res)
                let next = this.state;
                next.weatherData.sky = res.data.weather[0].description;
                next.weatherData.temp = Math.round(res.data.main.temp - 273.15) + ` C${String.fromCharCode(176)}`;
                next.weatherData.feelsLike = Math.round(res.data.main.feels_like - 273.15) + ` C${String.fromCharCode(176)}`;
                next.weatherData.press = res.data.main.pressure + `hPa`;
                next.weatherData.hum = res.data.main.humidity + `%`;
                next.weatherData.wind = res.data.wind.speed + `m/s`;
                this.setState(next);
            }).catch(err => {
                alert(`Something went wrong. Could not get weather data in ${this.state.inputValue.value}`)
                console.error(err);
            })
    }

    checkForecast(){
        console.log(`Forecast for five days in ${this.state.inputValue.value}`)
        axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${this.state.inputValue.value}&appid=${this.appId}`)
            .then(res => {
                console.log(res)
                let next = this.state;
                for (let i = 0; i <= 39; i++){
                    next.forecastData.time.push(moment(res.data.list[i].dt).format('llll'));
                    next.forecastData.sky.push(res.data.list[i].weather[0].description);
                    next.forecastData.temp.push(Math.round(res.data.list[i].main.temp - 273.15));
                    next.forecastData.feelsLike.push(Math.round(res.data.list[i].main.feels_like - 273.15));
                    next.forecastData.press.push(res.data.list[i].main.pressure);
                    next.forecastData.hum.push(res.data.list[i].main.humidity);
                    next.forecastData.wind.push(res.data.list[i].wind.speed);
                }
                this.setState(next);
            }).catch(err => {
                alert(`Something went wrong. Could not get forecast data in ${this.state.inputValue.value}`)
                console.error(err);
            })
    }

    handleKeyPress = (e) => {
        if(e.key === 'Enter'){
          console.log('enter press here!')
          this.handleClick();
        }
    }

    render () {
        return (
            <div>
            <header>
                <label htmlFor='cityName'>Enter city: </label>
                <input id ='cityName' type='text' pattern='A-Za-z' onKeyPress={this.handleKeyPress} required autoFocus value={this.state.inputValue.value} onChange={this.inputChange} ref={ref => this.input = ref} />
                <button type='button' onClick={this.handleClick}>Search</button>
            </header>
            <main>
                <button type='button' onClick={this.handleClick}>Weather today</button>
                <button type='button' onClick={this.checkForecast}>Forecast for five days</button>
                <table id='weather'>
                    <tbody>
                        <tr>
                            <th>Sky</th>
                            <td>{this.state.weatherData.sky}</td>
                        </tr>
                        <tr>
                            <th>Temperature</th>
                            <td>{this.state.weatherData.temp}</td>
                        </tr>
                        <tr>
                            <th>Feels like</th>
                            <td>{this.state.weatherData.feelsLike}</td>
                        </tr>
                        <tr>
                            <th>Atmospheric pressure</th>
                            <td>{this.state.weatherData.press}</td>
                        </tr>
                        <tr>
                            <th>Humidity</th>
                            <td>{this.state.weatherData.hum}</td>
                        </tr>
                        <tr>
                            <th>Wind</th>
                            <td>{this.state.weatherData.wind}</td>
                        </tr>
                    </tbody>
                </table>

                <table id='forecast'>
                    <tbody>
                        <tr>
                            <th id='date'>Date and time</th>
                            {this.state.forecastData.time.map(time=><td>{time}</td>)}
                        </tr>
                        <tr>
                            <th>Sky</th>
                            {this.state.forecastData.sky.map(sky=><td>{sky}</td>)}
                        </tr>
                        <tr>
                            <th>Temperature</th>
                            {this.state.forecastData.temp.map(temp=><td>{temp} С&#176;</td>)}
                        </tr>
                        <tr>
                            <th>Feels like</th>
                            {this.state.forecastData.feelsLike.map(feelsLike=><td>{feelsLike} С&#176;</td>)}
                        </tr>
                        <tr>
                            <th>Atmospheric pressure</th>
                            {this.state.forecastData.press.map(press=><td>{press} hPa</td>)}
                        </tr>
                        <tr>
                            <th>Humidity</th>
                            {this.state.forecastData.hum.map(hum=><td>{hum} %</td>)}
                        </tr>
                        <tr>
                            <th>Wind</th>
                            {this.state.forecastData.wind.map(wind=><td>{wind} m/s</td>)}
                        </tr>
                        </tbody>
                </table>

            </main>
            </div>
        )
    }
}