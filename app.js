const Joi = require('joi');
const path = require('path')
const express = require('express');
const fs = require('fs')

fs.readFile('/customer.json', 'utf-8', (err, jsonString) =>{
    if (err) {
        console.log(err);
    } else{
        try{
            const data = JSON.parse(jsonString);
            console.log(data)
        } catch {
            console.log('Error parsing JSON', err)
        }
    }
})


const app = express();

app.use(express.json());

const customers = [
    { id: 1, name: 'Adrian'},
]



app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get('/api/customers', (req, res) =>{
    res.send(customers)
})

app.post('/api/customers', (req, res) =>{

    const { error } = validateCustomer(req.body) // result.error
    if(error) return res.status(400).send(error.details[0].message);
    

    const customer = {
        id: customers.length + 1,
        name: req.body.name
    }
    customers.push(customer);
    res.send(customer);
})

app.get('/api/customers/:id', (req,res) =>{
    let customer = customers.find(c => c.id === parseInt(req.params.id))
    if (!customer) return res.status(404).send('The given ID was not found')
    res.send(customer)
})

app.put('/api/customers/:id', (req, res) =>{
    let customer = customers.find(c => c.id === parseInt(req.params.id))
    if (!customer) return res.status(404).send('The given ID was not found')

    const { error } = validateCustomer(req.body) // result.error

    if(error) return res.status(400).send(error.details[0].message)

    

    customer.name = req.body.name;
    res.send(customer);
})

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(customer, schema);
}

app.delete('/api/customers/:id', (req, res) => {
    let customer = customers.find(c => c.id === parseInt(req.params.id))
    if (!customer) return res.status(404).send('The given ID was not found')

    const index = customers.indexOf(customer)
    customers.splice(index, 1);

    res.send(customer);

})

// PORT

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}..`))
