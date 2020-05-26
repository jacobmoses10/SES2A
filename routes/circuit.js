const express = require('express');
const router = express.Router();
const quantumCircuit = require("quantum-circuit");
const CircuitFile = require('../models/CircuitFile');

var circuit = new quantumCircuit(2);

router.post('/addGate', async (req,res) => {
    console.log('adding gate');
    try{
        if(req.body.wire != null)
        {
            console.log('wire');
            console.log(req.body.gate + req.body.column + req.body.wire);
            circuit.addGate(req.body.gate, req.body.column, req.body.wire);
        }
        else
        {
            console.log('arrayOfWire');
            circuit.addGate(req.body.gateName, req.body.column, req.body.arrayOfWires);
        }
            res.json('success');
    } catch (err) {
        console.log('goes down here?');
        res.json({message: err});
    }
    

});

router.get('/reset', async (req,res) => {
    console.log('reseting circuit');
    circuit = new quantumCircuit(2);
    res.json('successfully reset');
})

router.get('/run', async (req,res) => {
    console.log('running circuit');
    if(req.body.array){
        circuit.run(req.body.array);
        console.log(circuit.probabilities());

    } else {
        circuit.run();
        console.log(circuit.probabilities());

    }
    res.status(200).send('success');
})

router.post('/probability', async (req,res) => {
    console.log('running circuit');

    if(req.body){
        console.log('states found: ' + req.body);
        circuit.run(req.body);
        console.log(circuit.probabilities());

    } else {
        console.log('no states found');
        circuit.run();
        console.log(circuit.probabilities());

    }
    console.log('Getting probability');
    console.log(circuit.probabilities());
    res.status(200).send(circuit.probabilities());
});

router.get('/measurement', async (req,res) => {
    console.log('Getting measurement');
    console.log(circuit.measureAll());
    res.status(200).send(circuit.measureAll());
});

router.post('/save/:fileName', async (req,res) => {
    console.log('Saving circuit');
    console.log(req.params.fileName);
    var file = circuit.save();
    const circuitFile = new CircuitFile({
        fileName: req.params.fileName,
        circuit: file
    });
    try{
        const newCircuitFile = await circuitFile.save();
        res.json(newCircuitFile);
    } catch (err) {
        res.json({message: err});
    }
});

router.get('/circuitList', async (req,res) => {
    console.log('Getting circuits');
    try{
        const circuits = await CircuitFile.find();
        res.json({circuits});
    }catch(err){
        res.json({messsage:err});
    }
});

router.post('/load', async (req,res) => {
    console.log('Loading circuit');
    console.log(req.body.name);
    
    try{
        const loadedCircuit = await CircuitFile.findOne(
            {
                fileName: req.body.name
            }
        );
        circuit.load(loadedCircuit.circuit);
        
        circuit.run();
        console.log(circuit.stateAsString(false));
        console.log('loaded circuit probability: ' + circuit.probabilities());
        res.json('success');
    } catch (err) {
        res.json({message: err});
    }
});

router.get('/getCircuits', async (req,res) => {
    console.log('Getting circuits');
    try{
        const circuits = await CircuitFile.find();
        res.json({circuits});
    }catch(err){
        res.json({messsage:err});
    }
})
module.exports = router;