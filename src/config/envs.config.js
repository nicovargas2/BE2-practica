//import 'dotenv/config';
import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: process.env.PORT || 3000,
    //SECRET: process.env.SECRET,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
}