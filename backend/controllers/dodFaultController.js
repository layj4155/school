const Fault = require('../models/Fault');

exports.createFault = async (req, res) => {
    try {
        const { name, pointsToDeduct, description } = req.body;

        const fault = await Fault.create({
            name,
            pointsToDeduct,
            description
        });

        res.status(201).json({
            success: true,
            data: fault
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getAllFaults = async (req, res) => {
    try {
        const faults = await Fault.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: faults.length,
            data: faults
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getFault = async (req, res) => {
    try {
        const fault = await Fault.findById(req.params.id);

        if (!fault) {
            return res.status(404).json({
                success: false,
                error: 'Fault not found'
            });
        }

        res.status(200).json({
            success: true,
            data: fault
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateFault = async (req, res) => {
    try {
        const fault = await Fault.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!fault) {
            return res.status(404).json({
                success: false,
                error: 'Fault not found'
            });
        }

        res.status(200).json({
            success: true,
            data: fault
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.deleteFault = async (req, res) => {
    try {
        const fault = await Fault.findByIdAndDelete(req.params.id);

        if (!fault) {
            return res.status(404).json({
                success: false,
                error: 'Fault not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
