const blogsModel = require("../models/blogs.model");

exports.SearchTitleBlog = async (description) => {
  try {
    const regex = new RegExp(description, "i");
    const BlogSearch = await blogsModel.find({ title: regex });
    return res
      .status(200)
      .json({ code: "200", message: "Successfully", data: BlogSearch });
  } catch (error) {
    console.log(error);
  }
};
