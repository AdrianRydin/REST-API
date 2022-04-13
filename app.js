const Joi = require('joi');
const path = require('path')
const express = require('express');


const app = express();

app.use(express.json());

const customers = [
    { 
        id: 1,
        name: 'Edwin',
        country: "Sweden"
    },
    {
        id: 2,
        name: 'Adrian',
        country: "Sweden"
    }
]


// GET

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get('/api/customers', (req, res) =>{
    res.send(customers)
})

app.get('/api/customers/:id', (req,res) =>{
    let customer = customers.find(c => c.id === parseInt(req.params.id))
    if (!customer) return res.status(404).send('The given ID was not found')
    res.send(customer)
})

// POST

app.post('/api/customers', (req, res) =>{


    const { error } = validateCustomer(req.body) // result.error
    if(error) return res.status(400).send(error.details[0].message);
    
     const customer = {
        id: customers.length + 1,
        name: req.body.name,
        country: req.body.country
    } 
    
    customers.push(customer);

})

// PUT
app.put('/api/customers/:id', (req, res) =>{
    let customer = customers.find(c => c.id === parseInt(req.params.id))
    if (!customer) return res.status(404).send('The given ID was not found')

    const { error } = validateCustomer(req.body) // result.error

    if(error) return res.status(400).send(error.details[0].message)


    customer.name = req.body.name;
    customer.country = req.body.country;
    res.send(customer);
})

// Delete

app.delete('/api/customers/:id', (req, res) => {
    let customer = customers.find(c => c.id === parseInt(req.params.id))
    if (!customer) return res.status(404).send('The given ID was not found')

    const index = customers.indexOf(customer)
    customers.splice(index, 1);

    res.send(customer);

})

// Validering

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).required(),
        country: Joi.string().min(3).required()
    }

    return Joi.validate(customer, schema);
}


// PORT

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}..`))
