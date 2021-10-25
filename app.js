const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
// 讀取 JSON 檔案，將種子資料載入應用程式
const restaurantList = require('./restaurant.json')

// 把資料帶入 handlebars 樣板中動態呈現
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
  // 操作 handlebars 中的 each 迴圈呈現出多張餐廳卡片
  res.render('index', { restaurants: restaurantList.results })
})

// 應用 params 打造動態路由
app.get('/restaurants/:restaurants_id', (req, res) => {
  const id = Number(req.params.restaurants_id)
  const restaurant = restaurantList.results.find((restaurant) => {
    return restaurant.id === id
  })
  res.render('show', { restaurant })
})

// 用 Query String 打造 search 功能
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const restaurants = restaurantList.results.filter((restaurant) => {
    return (restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase()))
  })

  if (!restaurants.length) {
    res.render('nosearch', { keyword })
  }

  res.render('index', { restaurants, keyword })
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
