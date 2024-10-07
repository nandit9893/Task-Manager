import User from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { emailRegex, isValidURL, phoneRegex } from "../utils/validation.js";

const saveUserDetails = async (req, res) => {
  const { name, email, phone, address, company, website } = req.body;
  const avatarLocalPath = req.file?.path;
  try {
    if (!name.trim()) {
      return res.status(401).json({
        success: false,
        message: "Name is required",
      });
    }
    if (name.length < 3) {
      return res.status(401).json({
        success: false,
        message: "Name must have at least three characters",
      });
    }

    if (!email.trim()) {
      return res.status(401).json({
        success: false,
        message: "Email is required",
      });
    }
    if (!emailRegex.test(email)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!phone.trim()) {
      return res.status(401).json({
        success: false,
        message: "Phone number is required",
      });
    }
    if (!phoneRegex.test(phone)) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number format",
      });
    }
    if (!address.trim()) {
      return res.status(401).json({
        success: false,
        message: "Address is required",
      });
    }

    if (company && company.trim().length < 3) {
      return res.status(401).json({
        success: false,
        message: "Company name must have at least three characters",
      });
    }

    if (website && !isValidURL(website)) {
      return res.status(401).json({
        success: false,
        message: "Invalid website URL format",
      });
    }

    const existingUserByPhone = await User.findOne({ phone: phone });
    if (existingUserByPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const existedUser = await User.findOne({ email: email });
    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    let avatarLocalPathURL = "";
    if (avatarLocalPath) {
      avatarLocalPathURL = await uploadOnCloudinary(avatarLocalPath);
      if (!avatarLocalPathURL) {
        return res.status(500).json({
          success: false,
          message: "Image uploading failed",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Image is required",
      });
    }

    const user = new User({
      name,
      email,
      phone,
      address,
      company: company || "",
      website: website || "",
      avatar: avatarLocalPathURL.url,
    });

    const username = `USER_${name.slice(0, 3).toUpperCase()}${user._id.toString().slice(-5).toUpperCase()}`;
    user.username = username;
    await user.save();

    const createdUser = await User.findById(user._id);
    if (!createdUser) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong while registering the user",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User details saved successfully",
      data: createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error saving user details",
      error: error.message,
    });
  }
};

const gettingAllUserData = async (req, res) => {
  try {
    const gettingUsers = await User.find({}).select("-avatar");
    if (gettingAllUserData.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User data is not available",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: gettingUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching details",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { userID } = req.params;
  try {
    const findUser = await User.findOne({ username: userID }).select(
      "name avatar"
    );
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not available",
      });
    }
    if (findUser.avatar) {
      await deleteFromCloudinary(findUser.avatar);
    }
    await User.findOneAndDelete({ username: userID });
    return res.status(200).json({
      success: true,
      message: `User ${findUser.name} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

const getSpecificUserData = async (req, res) => {
  const { userID } = req.params;
  if (!userID) {
    return res.status(401).json({
      success: false,
      message: "User ID is required",
    });
  }
  try {
    const userExit = await User.findOne({ username: userID });
    if (!userExit) {
      return res.status(401).json({
        success: false,
        message: "User not exist",
      });
    }
    return res.status(201).json({
      success: true,
      message: "User data fetched successfully",
      data: userExit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching user data",
      error: error.message,
    });
  }
};

const editUserData = async (req, res) => {
  const { userID } = req.params;
  const { email, phone, address, company, website } = req.body;
  const avatarLocalPath = req.file?.path;
  try {
    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "User ID is required",
      });
    }
    const user = await User.findOne({ username: userID });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (email && !emailRegex.test(email)) {
      return res.status(404).json({
        success: false,
        message: "Invalid email format",
      });
    }
    if (email && email === user.email) {
      return res.status(400).json({
        success: false,
        message: "Email should not matches with previous emails",
      });
    }
    const existingUserWithEmail = await User.findOne({ email });
    if (email && existingUserWithEmail) {
      return res.status(401).json({
        success: false,
        message: "Email already exists",
      });
    }
    if (phone && !phoneRegex.test(phone)) {
      return res.status(404).json({
        success: false,
        message: "Invalid phone number",
      });
    }
    if (phone && phone === user.phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number should not matches with previous phones",
      });
    }
    const existingUserWithPhone = await User.findOne({ phone });
    if (phone && existingUserWithPhone) {
      return res.status(401).json({
        success: false,
        message: "Phone number already exists",
      });
    }
    if (company) {
      if (company.trim().length < 3) {
        return res.status(401).json({
          success: false,
          message: "Company name must have at least three characters",
        });
      }
      if (!website) {
        return res.status(400).json({
          success: false,
          message: "Website is required for new company",
        });
      }
      if (user.company === company) {
        return res.status(400).json({
          success: false,
          message: "Company name matches with previous",
        });
      }
      if (website && !isValidURL(website)) {
        return res.status(401).json({
          success: false,
          message: "Invalid website URL format",
        });
      }
    }
    if (avatarLocalPath) {
      if (user.avatar) {
        await deleteFromCloudinary(user.avatar);
      }
      const avatarURL = await uploadOnCloudinary(avatarLocalPath);
      user.avatar = avatarURL.url;
    }
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (company) user.company = company;
    if (website) user.website = website;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User data updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating user data",
      error: error.message,
    });
  }
};

export {
  saveUserDetails,
  gettingAllUserData,
  deleteUser,
  getSpecificUserData,
  editUserData,
};
