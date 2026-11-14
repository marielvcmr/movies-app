import mongoose from 'mongoose';
import { ProgramType, Genre } from '../constants/enums.js';

// Movies and series share the "programs" collection; `type` tells them apart (Mongoose discriminator).
const DISCRIMINATOR_KEY = 'type';

const programSchema = new mongoose.Schema(
  {
    type: { type: String, enum: Object.values(ProgramType), required: true },
    externalId: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    titleNormalized: { type: String, required: true },
    // null until the detail is fetched from OMDb (Step 13).
    synopsis: { type: String, default: null },
    year: { type: Number, required: true },
    releaseDate: { type: Date, default: null },
    posterUrl: { type: String, default: null },
    genres: { type: [{ type: String, enum: Object.values(Genre) }], default: [] },
    actors: { type: [String], default: [] },
    // null while the group has no reviews (Step 15 recalculates them).
    pointsMeanNormal: { type: Number, default: null },
    pointsMeanCritics: { type: Number, default: null },
  },
  {
    discriminatorKey: DISCRIMINATOR_KEY,
    timestamps: true,
    toJSON: {
      // titleNormalized is internal (search only); __v is Mongoose bookkeeping.
      transform(doc, ret) {
        delete ret.titleNormalized;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Indexes from DESIGN.md → "Índices".
programSchema.index({ externalId: 1 }, { unique: true });
programSchema.index({ type: 1, year: -1, releaseDate: -1 });
programSchema.index({ titleNormalized: 1 });
programSchema.index({ genres: 1 });
programSchema.index({ pointsMeanNormal: -1 });
programSchema.index({ pointsMeanCritics: -1 });

export const Program = mongoose.model('Program', programSchema);

// Each discriminator adds its own field; `value` is what gets stored in `type`.
export const Movie = Program.discriminator(
  'Movie',
  new mongoose.Schema({ durationMin: { type: Number, default: null } }),
  { value: ProgramType.MOVIE },
);

export const Series = Program.discriminator(
  'Series',
  new mongoose.Schema({ seasonsCount: { type: Number, default: null } }),
  { value: ProgramType.SERIES },
);
