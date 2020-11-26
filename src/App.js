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
                time: [],
                sky: [],
                temp: [],
                feelsLike: [],
                press: [],
                hum: [],
                wind: [],
                isReceivedForDay: false,
                isReceivedForWeek: false
            }
        }
        this.inputRef = React.createRef();
        this.appId = 'd90eae9f9ee313a6fbfc12712b4104ea';
        this.inputChange = this.inputChange.bind(this);
        this.clear = this.clear.bind(this);
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

    clear(){
        let next = this.state.weatherData;
        next.time.length = 0;
        next.sky.length = 0;
        next.temp.length = 0;
        next.feelsLike.length = 0;
        next.press.length = 0;
        next.hum.length = 0;
        next.wind.length = 0;
    }

    handleClick(){
        console.log(`Weather in ${this.state.inputValue.value}`)
        if (this.state.weatherData.isReceivedForDay === false) {
            axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${this.state.inputValue.value}&appid=${this.appId}`)
            .then(res => {
                console.log(res)
                this.clear();
                let next = this.state.weatherData;
                next.isReceivedForDay = true;
                next.isReceivedForWeek = false;
                next.time.push(moment().format('llll'));
                next.sky.push(res.data.weather[0].description);
                next.temp.push(Math.round(res.data.main.temp - 273.15));
                next.feelsLike.push(Math.round(res.data.main.feels_like - 273.15));
                next.press.push(res.data.main.pressure);
                next.hum.push(res.data.main.humidity);
                next.wind.push(res.data.wind.speed);
                this.setState(next);
            }).catch(err => {
                alert(`Something went wrong. Could not get weather data in ${this.state.inputValue.value}`)
                console.error(err);
            })
        } 
    }

    checkForecast(){
        console.log(`Forecast for five days in ${this.state.inputValue.value}`)
        if (this.state.weatherData.isReceivedForWeek === false) {
        axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${this.state.inputValue.value}&appid=${this.appId}`)
            .then(res => {
                console.log(res);
                this.clear();
                let next = this.state.weatherData;
                next.isReceivedForDay = false;
                next.isReceivedForWeek = true;
                for (let i = 0; i <= 39; i++){
                    next.time.push(res.data.list[i].dt);
                    next.sky.push(res.data.list[i].weather[0].description);
                    next.temp.push(Math.round(res.data.list[i].main.temp - 273.15));
                    next.feelsLike.push(Math.round(res.data.list[i].main.feels_like - 273.15));
                    next.press.push(res.data.list[i].main.pressure);
                    next.hum.push(res.data.list[i].main.humidity);
                    next.wind.push(res.data.list[i].wind.speed);
                }
                this.setState(next);
            }).catch(err => {
                alert(`Something went wrong. Could not get forecast data in ${this.state.inputValue.value}`)
                console.error(err);
            })
        }
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter'){
            console.log('The user pressed enter!')
            if (this.inputRef.current.value.length === 0){
                alert('Please enter city');
            } else 
                this.handleClick();
        }
    }

    render () {
        const state = this.state.weatherData;
        return (
            <div>
            <header>
                <label htmlFor='cityName'>Enter city: </label>
                <input id ='cityName' type='text' pattern='A-Za-z' onKeyPress={this.handleKeyPress} required autoFocus value={this.state.inputValue.value} onChange={this.inputChange} ref={this.inputRef} />
                <button type='button' onClick={this.handleClick}>Search</button>
            </header>
            <main>
                <button type='button' onClick={this.handleClick}>Weather today</button>
                <button type='button' onClick={this.checkForecast}>Forecast for five days</button>
                <table>
                    <tbody id='weather'>
                        <tr>
                            <th>Date and time</th>
                            {state.time.map(time=><td key={time.id}>{time}</td>)}
                        </tr>
                        <tr>
                            <th>Sky</th>
                            {state.sky.map(sky=><td key={sky.id}>{sky}</td>)}
                        </tr>
                        <tr>
                            <th>Temperature</th>
                            {state.temp.map(temp=><td key={temp.id}>{temp} С&#176;</td>)}
                        </tr>
                        <tr>
                            <th>Feels like</th>
                            {state.feelsLike.map(feelsLike=><td key={feelsLike.id}>{feelsLike} С&#176;</td>)}
                        </tr>
                        <tr>
                            <th>Atmospheric pressure</th>
                            {state.press.map(press=><td key={press.id}>{press} hPa</td>)}
                        </tr>
                        <tr>
                            <th>Humidity</th>
                            {state.hum.map(hum=><td key={hum.id}>{hum} %</td>)}
                        </tr>
                        <tr>
                            <th>Wind</th>
                            {state.wind.map(wind=><td key={wind.id}>{wind} m/s</td>)}
                        </tr>
                    </tbody>
                </table>

            </main>
            </div>
        )
    }
}