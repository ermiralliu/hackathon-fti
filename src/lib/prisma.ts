import { config } from 'dotenv';  //for some reason the new prisma client needs an explicit this
// i guess the old one had a lot more stuff though
config();
import {PrismaClient} from '../generated/prisma/client';

const prisma = new PrismaClient();

export default prisma;