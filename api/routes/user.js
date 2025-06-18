const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const User = require("../models/User")

// Check if user exists by phone
router.get("/isUserExist", async (req, res) => {
  try {
    const { phone } = req.query
    const user = await User.findOne({ phone })

    if (user) {
      return res.json({ exist: true, type: user.type })
    } else {
      return res.json({ exist: false, message: "User not found" })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Login with credentials (phone + password)
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body

    // Find user by phone
    const user = await User.findOne({ phone })
    if (!user) {
      return res.json({ valid: false, message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.json({ valid: false, message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

    // Set token in header
    res.header("Authorization", token)

    // Return user data
    res.json({
      valid: true,
      user: {
        _id: user._id,
        type: user.type,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Create client user
router.post("/client", async (req, res) => {
  try {
    const { phone, password } = req.body

    // Check if user already exists
    let user = await User.findOne({ phone })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      type: 0, // Client type
      phone,
      password,
      first_name: "",
      last_name: "",
      profile_photo: "default.jpg",
    })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Save user
    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

    // Set token in header
    res.header("Authorization", token)

    // Return user data
    res.json({
      user: {
        _id: user._id,
        type: user.type,
        phone: user.phone,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Create driver user
router.post("/driver", async (req, res) => {
  try {
    const { first_name, last_name, phone, password, driving_license, date_of_birth, city, country } = req.body

    // Check if user already exists
    let user = await User.findOne({ phone })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      type: 1, // Driver type
      available: true,
      approved: false,
      profile_photo: "default.jpg",
      license_photo: null,
      first_name,
      last_name,
      phone,
      password,
      driving_license,
      date_of_birth,
      city,
      country,
      vehicles: [],
    })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Save user
    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

    // Set token in header
    res.header("Authorization", token)

    // Return user data
    res.json({
      user: {
        _id: user._id,
        type: user.type,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user profile
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user fields
    const updateFields = { ...req.body }

    // If password is being updated, hash it
    if (updateFields.password) {
      const salt = await bcrypt.genSalt(10)
      updateFields.password = await bcrypt.hash(updateFields.password, salt)
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true }).select(
      "-password",
    )

    res.json(updatedUser)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get driver status
router.get("/driver/status/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("available approved")
    if (!user) {
      return res.status(404).json({ message: "Driver not found" })
    }
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update driver status
router.put("/driver/status/:id", auth, async (req, res) => {
  try {
    const { status } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { $set: { available: status } }, { new: true }).select(
      "available",
    )

    if (!user) {
      return res.status(404).json({ message: "Driver not found" })
    }

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all drivers pending approval (admin only)
router.get("/driver/pending", auth, async (req, res) => {
  try {
    // Check if user is admin
    const admin = await User.findById(req.user.id)
    if (!admin || admin.type !== 2) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const drivers = await User.find({ type: 1, approved: false }).select("-password")
    res.json(drivers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Approve driver (admin only)
router.put("/driver/approve/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const admin = await User.findById(req.user.id)
    if (!admin || admin.type !== 2) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const driver = await User.findByIdAndUpdate(req.params.id, { $set: { approved: true } }, { new: true }).select(
      "-password",
    )

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" })
    }

    res.json(driver)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
