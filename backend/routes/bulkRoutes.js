const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");

// JSON middleware
router.use(express.json());

// Helper function to validate ObjectIds
const validateObjectIds = (ids) => {
  if (!Array.isArray(ids)) return { valid: false, message: "Product IDs must be an array" };
  if (ids.length === 0) return { valid: false, message: "At least one product ID is required" };
  
  const validIds = [];
  for (const id of ids) {
    if (!id || typeof id !== 'string') {
      return { valid: false, message: "Invalid product ID format" };
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { valid: false, message: `Invalid product ID: ${id}` };
    }
    validIds.push(new mongoose.Types.ObjectId(id));
  }
  
  return { valid: true, objectIds: validIds };
};

// Bulk Update Route
router.post("/update", async (req, res) => {
  try {
    console.log("📦 Bulk update request:", JSON.stringify(req.body, null, 2));
    
    const { productIds, updates } = req.body;
    
    // Validate input
    const validation = validateObjectIds(productIds);
    if (!validation.valid) {
      console.error("❌ Validation failed:", validation.message);
      return res.status(400).json({ 
        success: false, 
        error: validation.message 
      });
    }
    
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: "Updates object is required" 
      });
    }
    
    // Only allow specific fields
    const allowedFields = ['featured', 'inStock', 'price'];
    const cleanUpdates = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        cleanUpdates[key] = value;
      }
    }
    
    if (Object.keys(cleanUpdates).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "No valid update fields provided" 
      });
    }
    
    console.log("🔄 Updating products:", {
      objectIds: validation.objectIds,
      updates: cleanUpdates,
      userId: req.session.userId
    });
    
    // Update products
    const result = await Product.updateMany(
      { 
        _id: { $in: validation.objectIds },
        owner: req.session.userId 
      },
      { $set: cleanUpdates }
    );
    
    console.log("✅ Update result:", result);
    
    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      message: `Updated ${result.modifiedCount} product(s)`
    });
    
  } catch (error) {
    console.error("❌ Bulk update error:", error);
    res.status(500).json({
      success: false,
      error: "Server error: " + error.message
    });
  }
});

// Bulk Delete Route
router.post("/delete", async (req, res) => {
  try {
    console.log("🗑️ Bulk delete request:", JSON.stringify(req.body, null, 2));
    
    const { productIds } = req.body;
    
    // Validate input
    const validation = validateObjectIds(productIds);
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: validation.message 
      });
    }
    
    // Delete products
    const result = await Product.deleteMany({
      _id: { $in: validation.objectIds },
      owner: req.session.userId
    });
    
    console.log("✅ Delete result:", result);
    
    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} product(s)`
    });
    
  } catch (error) {
    console.error("❌ Bulk delete error:", error);
    res.status(500).json({
      success: false,
      error: "Server error: " + error.message
    });
  }
});

module.exports = router;