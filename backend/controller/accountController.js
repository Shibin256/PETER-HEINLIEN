import otpModel from "../model/otpModel.js"
import User from "../model/userModel.js"
import bcrypt from 'bcrypt'
import cloudinary from "../utils/cloudinary.js";
import Address from "../model/addressModal.js";
import mongoose from "mongoose";
const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);

export const changeName = async (req, res) => {
    try {
        const { id } = req.params
        const newName = req.body.name
        const user = await User.findById(id).select('-password')
        if (!user) return res.status(404).json({ message: 'User not found' })

        user.username = newName

        await user.save();

        res.status(200).json({ data: user, message: `User name successfully changed to ${user.username}` })

    } catch (error) {
        console.error('Error changing user name:', error.message);
        res.status(500).json({ message: 'Server error while changing user name' });
    }
}

// export const EditOTPGeneration = async (req, res) => {
//   try {
//     const { email } = req.body;
//     console.log('email ======', email);

//     const userExist = await User.findOne({ email });
//     if (!userExist) {
//       return res.status(400).json({ message: "User does not exist" });
//     }

//     const otp = genarateOtp();
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
//     console.log('otp is: ----', otp);

//     // Remove any previous OTP
//     await otpModel.findOneAndDelete({ email });
//     await otpModel.create({ email, otp, expiresAt });

//     const emailSend = await sendVerificationEmail(email, otp);
//     if (!emailSend) {
//       return res.status(400).json({ message: "OTP not sent. Email error." });
//     }

//     return res.status(200).json({ message: 'The OTP has been sent to the email', email });

//   } catch (error) {
//     console.error("Reset password error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const changeOrAddMobile = async (req, res) => {
    try {
        const { id } = req.params;
        const newNumber = req.body.phone;

        if (!newNumber) {
            return res.status(400).json({ message: 'Mobile number is required' });
        }

        const user = await User.findById(id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const phoneExist = await User.findOne({ phone: newNumber });
        if (phoneExist && phoneExist.phone != null) {
            return res.status(400).json({ message: "The mobile number is already exists" });
        }

        const isNew = !user.phone;
        user.phone = newNumber;

        await user.save();

        res.status(200).json({
            data: user,
            message: isNew
                ? 'Mobile number successfully added'
                : 'Mobile number successfully updated',
        });
    } catch (error) {
        console.error('Error updating mobile number:', error.message);
        res.status(500).json({
            message: 'Server error while updating mobile number',
            data: true
        });
    }
};


export const editPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password must match' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'You entered a wrong current password' });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'You entered the same password. Please choose a different one.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedNewPassword;
        await user.save();

        // ✅ Remove password from user object before sending
        const { password, ...userWithoutPassword } = user.toObject();

        return res.status(200).json({
            data: userWithoutPassword,
            message: 'User password changed successfully'
        });

    } catch (error) {
        console.error('Error updating password:', error.message);
        return res.status(500).json({ message: 'Server error while updating password' });
    }
};

export const editImage = async (req, res) => {
    try {
        const { id } = req.params
        const img = req.file
        console.log(req.file)
        const user = await User.findById(id).select('-password')

        const result = await cloudinary.uploader.upload(img.path)
        const uploadedImage = result.secure_url
        user.profileImage = uploadedImage
        await user.save();
        res.status(200).json({ data: user, message: 'user added sucessfully' })
    } catch (error) {
        console.error('Error updating image:', error.message);
        return res.status(500).json({ message: 'Server error while updating image' });
    }
}

export const addAddress = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)

        const { name, house, locality, city, state, pin, phone, altPhone, addressType, defaultAddress } = req.body

        // console.log(name,'---',locality,phone,city,state,pin)
        const newAddress = new Address({
            _id: new mongoose.Types.ObjectId(),
            name,
            house,
            locality,
            city,
            state,
            pincode: pin,
            phone,
            alternativePhone: altPhone,
            addressType,
            defaultAddress
        })

        const user = await User.findById(id).select('-password')
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await newAddress.save()

        user.addresses.push(newAddress._id);
        await user.save();
        console.log(user, '-----')
        res.status(201).json({ message: "address created", user: user, address: newAddress })
    } catch (error) {
        console.error('Error updating address:', error.message);
        return res.status(500).json({ message: 'Server error while updating address' });
    }
}



export const getAllAddress = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select('-password').populate('addresses').lean()
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user addresses:', error.message);
        res.status(500).json({ message: "Server error" });
    }
}

export const removeAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params
        const user = await User.findById(userId).select('-password')
        console.log(user, 'user----')
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const addressExist = user.addresses.includes(addressId)
        if (!addressExist) {
            return res.status(400).json({ message: "Address does not belong to this user" });
        }

        await Address.findByIdAndDelete(addressId)

        user.addresses = user.addresses.filter(id => id.toString() !== addressId)

        await user.save();

        res.status(200).json({ message: "Address removed successfully", user: user });

    } catch (error) {
        console.error('Error deleting user addresses:', error.message);
        res.status(500).json({ message: "Server error" });
    }
}

// users block and upblock part
export const SetDefaultAddress = async (req, res) => {
     try {
    const { userId, addressId } = req.params;

    // Step 1: Get user and validate
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Step 2: Check if address belongs to the user
    const belongsToUser = user.addresses.some(id => id.toString() === addressId);
    if (!belongsToUser) {
      return res.status(400).json({ message: 'Address does not belong to this user' });
    }

    // Step 3: Unset default for all of this user's addresses
    await Address.updateMany(
      { _id: { $in: user.addresses } },
      { $set: { defaultAddress: false } }
    );

    // Step 4: Set selected address as default
    await Address.findByIdAndUpdate(addressId, { defaultAddress: true });

    res.status(200).json({ message: 'Default address set successfully' });
  } catch (error) {
    console.error('Error setting default address:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const updateAddress = async (req, res) => {
    const { addressId } = req.params
    const { name, house, locality, city, state, pincode, phone, alternativePhone, addressType, defaultAddress } = req.body
    const updatedData = {
        name,
        house,
        locality,
        city,
        state,
        pincode,
        phone,
        alternativePhone,
        addressType,
        defaultAddress
    }

    const updatedAdress = await Address.findByIdAndUpdate(addressId, updatedData, {
        new: true
    })


    if (!updatedAdress) {
        return res.status(404).json({ message: 'address not found' });
    }

    res.status(200).json(updateAddress);

}