// const User = require("../models");

// const { User } = require("../models");


// Middleware to check if the user has "admin" role
// const isAdmin = async (req, res, next) => {
//     try {
//         // Get the logged-in user's ID from req (this may be stored in the session, JWT, etc.)
//         console.log(req.authUser, "req.authUser");

//         const userId = req.authUser; // Assume userId is stored in req after authentication
//         console.log(userId, "userId");
//         console.log(userId._id, "userId._id");


//         // Fetch the user from the database
//         const user = await User.findOne(userId._id).populate("roles");

//         // Check if the user has the "admin" role
//         console.log(user, "user");

//         if (user.roles.name === "admin") {
//             return next(); // Allow the request to proceed
//         } else {
//             return res.status(403).json({ message: "Only admins can create products" });
//         }
//     } catch (error) {
//         return res.status(500).json({ message: "Server error", error });
//     }
// };


// module.exports = { isAdmin };