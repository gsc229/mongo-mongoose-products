// @desc    Upoload a vendor's avatar photo
// @route   POST /api/v1.0/vendors/:id
// @access  Private
exports.avatarPhotoUpload = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  console.log(req.files);
  if (!vendor) {
    return next(
      new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404)
    )
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  //Check to make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse(`Please upload an image file`, 400)
    );
  }
  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
    );
  }

  // Create a custom filename base off of vendor id
  file.name = `photo_${vendor._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.AVATAR_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Vendor.findByIdAndUpdate(req.params.id, { avatar: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });

  })

})