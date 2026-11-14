import { Review } from '../models/Review.js';
import { Program } from '../models/Program.js';
import { User } from '../models/User.js';
import { UserType } from '../constants/enums.js';
import { toObjectId } from '../utils/objectId.js';

// The single entry point for averages (DESIGN.md → "Puntajes").
// Called after a review is created, edited or deleted. Step 16 calls it after type changes and account deletion.
export async function recalculateProgramAverages(programId) {
  const groups = await Review.aggregate([
    { $match: { program: toObjectId(programId) } },
    // Join each review with its author, to know the author's current type.
    { $lookup: { from: User.collection.name, localField: 'author', foreignField: '_id', as: 'author' } },
    { $unwind: '$author' },
    // Two groups: _id true = critics, _id false = normal + admin.
    { $group: { _id: { $eq: ['$author.type', UserType.CRITIC] }, mean: { $avg: '$points' } } },
  ]);

  const meanOf = (isCriticGroup) => groups.find((group) => group._id === isCriticGroup)?.mean ?? null;

  await Program.updateOne(
    { _id: programId },
    { $set: { pointsMeanCritics: meanOf(true), pointsMeanNormal: meanOf(false) } },
  );
}
