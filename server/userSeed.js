import User from './models/User.js'
import bcrypt from 'bcrypt'
import connectToDatabase from './db/db.js'

const userRegister = async () => {
    try {
        await connectToDatabase(); // Await here to ensure DB is connected

        const hashPassword = await bcrypt.hash("S@f3rAdm1nP@ss!", 10);


        const userExists = await User.findOne({ email: "admini@gmail.com" })
        if (userExists) {
            console.log("User already exists");
            return;
        }

        const newUser = new User({
            name: "Admin",
            email: "admini@gmail.com",
            password: hashPassword,
            role: "admin"
        })

        await newUser.save()
        console.log("Admin user created successfully!")
        process.exit(0) // Exit process after success
    } catch (error) {
        console.error("Error seeding user:", error);
        process.exit(1)
    }
}

userRegister();
