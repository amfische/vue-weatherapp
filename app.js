new Vue({
	el: '.display',
	data: {
		city: '-- --',
		temp: 0,
		unit: 'F',
		icon: 'wi-na',
		iconDescription: '-- --',
		input: '',
		loading: true
	},
	methods: {
		farenheight() {
			if (this.unit !== 'F') {
				this.temp = parseFloat((this.temp * 1.8 + 32).toFixed(2))
				this.unit = 'F'
			}
		},
		celsius() {
			if (this.unit !== 'C') {
				this.temp = parseFloat(((this.temp - 32) / 1.8).toFixed(2))
				this.unit = 'C'
			}
		},
		getUserLocation() {
			return new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition((position) => {
					resolve(position.coords)
				}, function() {
					reject('Location not available')
				})
			})
		},
		getLocalWeather() {
			this.loading = true
			if ("geolocation" in navigator) {
				this.getUserLocation()
					.then((e) => {
						let openWeatherMapURL = "https://api.openweathermap.org/data/2.5/weather" + 
							"?lat=" + e.latitude + 
							"&lon=" + e.longitude + 
							"&appid=51f61b5f031e34a4e3c790f126690615" + 
							"&units=imperial"
						return axios.get(openWeatherMapURL)
					})
					.then((response) => {
						this.displayResults(response)
					})
					.catch((error) => {
						if (typeof(error) === 'string') {
							this.displayError(error)	
						} else {
							this.displayError(error.response.statusText)
						}
					})
			} else {
				let message = 'Geolocation not available in this browser, please try another browser or search by city'
				this.displayError(message)
			}	
		},
		searchWeatherByCity() {
			this.loading = true
			let openWeatherMapURL = "https://api.openweathermap.org/data/2.5/weather" + 
				"?q=" + this.input + 
				"&appid=51f61b5f031e34a4e3c790f126690615" + 
				"&units=imperial"
			axios.get(openWeatherMapURL)
				.then((response) => {
					this.displayResults(response)
				})
				.catch((error) => {
					this.displayError(error.response.data.message)
				})
		},
		displayResults(response) {
			this.loading = false
			this.city = response.data.name + ', ' + response.data.sys.country
			this.temp = response.data.main.temp
			this.unit = 'F'
			this.setIcon(response.data.weather[0].icon)
			this.iconDescription = response.data.weather[0].description
		},
		displayError(message) {
			this.loading = false
			this.city = '-- --'
			this.temp = 0
			this.setIcon('n/a')
			this.iconDescription = message
		},
		setIcon(icon) {
			let _this = this
			switch (icon) {
				case '01d':
					_this.icon = 'wi-day-sunny'
					break
				case '01n':
					_this.icon = 'wi-night-clear'
					break
				case '02d':
				case '03d':
				case '04d':
					_this.icon = 'wi-day-cloudy'
					break
				case '02n':
				case '03n':
				case '04n':
					_this.icon = 'wi-night-alt-cloudy'
					break	
				case '09d':
					_this.icon = 'wi-day-showers'
					break
				case '09n':
					_this.icon = 'wi-night-alt-showers'
					break
				case '10d':
					_this.icon = 'wi-day-rain'
					break
				case '10n':
					_this.icon = 'wi-night-alt-rain'
					break
				case '11d':
					_this.icon = 'wi-day-lightning'
					break
				case '11n':
					_this.icon = 'wi-night-alt-thunderstorm'
					break
				case '13d':
					_this.icon = 'wi-day-snow'
					break
				case '13n':
					_this.icon = 'wi-night-alt-snow'
					break
				case '50d':
					_this.icon = 'wi-day-fog'
					break
				case '50n':
					_this.icon = 'wi-night-fog'
					break
				default:
					_this.icon = 'wi-na'
			}
		}
	},
	mounted() {
		this.getLocalWeather()
	}

})
