const express=require('express');
const app=express();
const cors=require('cors');

app.use(cors());
app.use(express.json());

const Favourite = require('./routes/favourite');
const Cart = require('./routes/cart');
const User = require('./models/user');

require('dotenv').config();
require('./conn/conn');

app.use('/api/v1/user', require('./routes/user'));
app.use('/api/v1/userAuth', require('./routes/userAuth'));
app.use('/api/v1/book', require('./routes/book'));
app.use('/api/v1/favourite', Favourite);
app.use('/api/v1/cart', Cart);
app.use('/api/v1/order', require('./routes/order'));

app.listen(process.env.PORT ,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});
