const express = require('express'); //import express
const Joi = require('joi'); //import joi
const app = express(); //create express application on the app variable.
app.use(express.json()); //used the json file 

//give the data to the server
const customers= [
    {title: 'George', id:1},
    {title: 'Josh', id:2},
    {title: 'Tyler', id:3},
    {title: 'Alice', id:4},
    {title: 'Candice', id:5}
]

//Read request handler
//display the message when the url consists of '/'
app.get('/', (req, res) => {
    res.send('welcome to Rest API');
});

//display the list of the customers when url consists of api customers
app.get('/api/customers', (req,res) =>
{
    res.send(customers);
});

//display the information of specific customer when you mention id 
app.get('/api/customers/:id', (req,res) => {
    const customer = customers.find( c => c.id === parseInt(req.params.id));
    //if there is no valid customer id then display an error with following message
    if (!customer) res.status(404).send('<h2> style="color:red" Oops.. can not find what you were looking for </h2>');
    res.send(customer);
});

//create request handler
//create new customer information
app.post('/api/customers', (req,res) =>
{
    const {error} = ValidateCustomer(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    //increment the customer id
    const customer ={
        title : req.body.title,
        id: customers.length+1
    };
    customers.push(customer);
    res.send(customer);
});

//update request handler 
//update existing customer information
app.put('/api/customers/:id',(req,res)=>
{
    const customer = customers.find(c => c.id ===parseInt(req.params.id));
    if (!customer) res.status(404).send('<h2> style="color:red" Oops.. can not find what you were looking for </h2>');
    const {error} = ValidateCustomer(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return ;
    }
    customer.title = req.body.title;
    res.send(customer);
});


//delete request handler 
//DELETE CUSTOMER DETAILS
app.delete('/api/customers/:id', (req,res) =>
{
    const customer =customers.find ( c=> c.id === parseInt(req.params.id));
    if(!customer) res.status(404).send('<h2> style="color:red" Oops.. can not find what you were looking for </h2>');
    const index = customers.indexOf(customer);
    customers.splice(index, 1);
    for( var i =0; i<customers.length; i++)
    {
        customers[i].index=i+1;
    }
    
    res.send(customer);
    
});

//Validate Information
function ValidateCustomer(customer){
    const schema={
        title : Joi.string().min(3).required()
    };
    return Joi.validate(customer, schema);
}

//Port Enviornment variable 
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port $(port)...'));