const express = require('express');
const router = express.Router();
const rwandaLocations = require('../utils/rwandaLocations');

router.get('/provinces', (req, res) => {
    try {
        const provinces = Object.keys(rwandaLocations);
        res.status(200).json({
            success: true,
            data: provinces
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/districts/:province', (req, res) => {
    try {
        const { province } = req.params;
        const provinceData = rwandaLocations[province];
        
        if (!provinceData) {
            return res.status(404).json({
                success: false,
                error: 'Province not found'
            });
        }

        res.status(200).json({
            success: true,
            data: provinceData.districts
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/all', (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: rwandaLocations
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
