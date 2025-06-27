// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
    
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     fullName: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6,
//     },
//     profilePic: {
//         type: String,
//         default: "",
//     },
// }
// , {
//     timestamps: true,
// }); 

// const User = mongoose.model("User", userSchema);

// export default User




import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // important pour éviter les doublons
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "https://avatar.iran.liara.run/public/boy?username=guest"
  },
}, { timestamps: true }); // ajoute automatiquement createdAt et updatedAt

const User = mongoose.model("User", userSchema);
export default User;
