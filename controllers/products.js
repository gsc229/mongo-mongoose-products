const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse'); // allows custom error responses
const asyncHandler = require('../middleware/async'); // keeps code DRY


// @desc    Get products
// @route   GET /api/v1.0/products
// @route   GET /api/v1.0/vendors/:vendorId/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {

    console.log('getAllPs req.query: ', req.query);

    let query;
    if (req.params.vendorId) {
        query = Product.find({
            vendor: req.params.vendorId
        })
    } else {
        query = Product.find().populate({
            path: 'vendor',
            select: 'business_name description'
        });
    }

    const products = await query;

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// @desc    Get a single products
// @route   GET /api/v1.0/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'vendor',
        select: 'business_name description'
    });

    if (!product) {
        return next(new ErrorResponse(`No product with the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        count: product.length,
        data: product
    });
});

// @desc    Add a new product
// @route   POST /api/v1.0/products
// @access  Private
exports.addProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create(req.body);
    console.log(product.product_images.typof);
    res.status(200).json({
        success: true,
        count: product.length,
        data: product
    })
})

// @desc    Edit a product
// @route   PUT /api/v1.0/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with the id of ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ success: true, data: product });
});

// @desc    Delete a product
// @route   DELETE /api/v1.0/products
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    product.remove();

    res.status(200).json({ success: true, data: {} });
});