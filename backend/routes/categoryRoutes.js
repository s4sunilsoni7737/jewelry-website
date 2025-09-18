const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Product = require("../models/Product");
const { requireLogin } = require("../middleware/auth");
const { sanitizeString } = require("../middleware/validation");

// ===============================
// Show Add Category Form
// ===============================
router.get("/add", requireLogin, (req, res) => {
  res.render("categories/add");
});

// ===============================
// Add Category
// ===============================
router.post("/add", requireLogin, async (req, res) => {
  let { name, nameHindi, icon, description } = req.body;

  // Sanitize inputs
  name = sanitizeString(name);
  nameHindi = sanitizeString(nameHindi);
  icon = sanitizeString(icon);
  description = sanitizeString(description);

  // Validate inputs
  if (!name || name.length < 2) {
    req.flash("error_msg", "❌ Category name must be at least 2 characters long");
    return res.redirect("/categories/add");
  }
  if (!nameHindi || nameHindi.length < 1) {
    req.flash("error_msg", "❌ Category name in Hindi is required");
    return res.redirect("/categories/add");
  }

  try {
    // Check if category already exists for this user
    const existingCategory = await Category.findOne({ 
      name: name.toLowerCase().trim(), 
      owner: req.session.userId 
    });
    if (existingCategory) {
      req.flash("error_msg", "❌ Category already exists");
      return res.redirect("/categories/add");
    }

    await Category.create({
      name: name.toLowerCase().trim(),
      nameHindi: nameHindi.trim(),
      icon: icon || "📦",
      description: description || "",
      owner: req.session.userId // ✅ Use session user ID directly
    });

    req.flash("success_msg", "✅ Category added successfully!");
    res.redirect("/products");
  } catch (err) {
    console.error("Error creating category:", err);
    if (err.code === 11000) {
      req.flash("error_msg", "❌ Category name already exists");
    } else {
      req.flash("error_msg", "❌ Error creating category");
    }
    res.redirect("/categories/add");
  }
});

// ===============================
// Show Edit Form
// ===============================
router.get("/edit/:id", requireLogin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash("error_msg", "❌ Category not found");
      return res.redirect("/products");
    }
    res.render("categories/edit", { category });
  } catch (err) {
    console.error("Error loading category:", err);
    req.flash("error_msg", "❌ Error loading category");
    res.redirect("/products");
  }
});

// ===============================
// Update Category
// ===============================
router.post("/edit/:id", requireLogin, async (req, res) => {
  let { name, nameHindi, icon, description } = req.body;

  // Sanitize inputs
  name = sanitizeString(name);
  nameHindi = sanitizeString(nameHindi);
  icon = sanitizeString(icon);
  description = sanitizeString(description);

  // Validate inputs
  if (!name || name.length < 2) {
    req.flash("error_msg", "❌ Category name must be at least 2 characters long");
    return res.redirect(`/categories/edit/${req.params.id}`);
  }
  if (!nameHindi || nameHindi.length < 1) {
    req.flash("error_msg", "❌ Category name in Hindi is required");
    return res.redirect(`/categories/edit/${req.params.id}`);
  }

  try {
    // Check if another category with same name exists for this user
    const existingCategory = await Category.findOne({
      name: name.toLowerCase().trim(),
      owner: req.session.userId,
      _id: { $ne: req.params.id }
    });
    if (existingCategory) {
      req.flash("error_msg", "❌ Another category with this name already exists");
      return res.redirect(`/categories/edit/${req.params.id}`);
    }

    await Category.findByIdAndUpdate(req.params.id, {
      name: name.toLowerCase().trim(),
      nameHindi: nameHindi.trim(),
      icon: icon || "📦",
      description: description || ""
    });

    req.flash("success_msg", "✅ Category updated successfully!");
    res.redirect("/products");
  } catch (err) {
    console.error("Error updating category:", err);
    req.flash("error_msg", "❌ Error updating category");
    res.redirect(`/categories/edit/${req.params.id}`);
  }
});

// ===============================
// Delete Category
// ===============================
router.post("/delete/:id", requireLogin, async (req, res) => {
  try {
    // Check if category exists
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash("error_msg", "❌ Category not found");
      return res.redirect("/products");
    }

    // Check if any products are using this category
    const productsUsingCategory = await Product.countDocuments({ category: req.params.id });
    if (productsUsingCategory > 0) {
      req.flash(
        "error_msg",
        `❌ Cannot delete category. ${productsUsingCategory} product(s) are using this category.`
      );
      return res.redirect("/products");
    }

    await Category.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "🗑️ Category deleted successfully!");
    res.redirect("/products");
  } catch (err) {
    console.error("Error deleting category:", err);
    req.flash("error_msg", "❌ Error deleting category");
    res.redirect("/products");
  }
});

// ===============================
// GET all categories (API endpoint)
// ===============================
router.get("/api/all", async (req, res) => {
  try {
    const categories = await Category.find({ owner: req.session.userId }).sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ success: false, message: "Error fetching categories" });
  }
});

module.exports = router;
