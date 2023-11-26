import mongoose from "mongoose";

export const validObjectId = (id: string) =>
	mongoose.Types.ObjectId.isValid(id);
