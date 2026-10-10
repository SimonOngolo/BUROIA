import mongoose, { Schema, models } from "mongoose";

const KioskSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  code: { type: String, required: true, uppercase: true, trim: true },
  location: { type: String, required: true, maxlength: 200 },
  status: { type: String, enum: ["ONLINE", "BUSY", "DEGRADED", "OFFLINE", "MAINTENANCE", "ERROR"], default: "OFFLINE", index: true },
  transactionsToday: { type: Number, min: 0, default: 0 },
  revenueToday: { type: Number, min: 0, default: 0 },
  uptimePercent: { type: Number, min: 0, max: 100, default: 0 },
  consumables: {
    paperPercent: { type: Number, min: 0, max: 100, default: 100 },
    tonerPercent: { type: Number, min: 0, max: 100, default: 100 },
  },
  lastHeartbeatAt: { type: Date, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

KioskSchema.index({ tenantId: 1, code: 1 }, { unique: true });

const Kiosk = models.Kiosk || mongoose.model("Kiosk", KioskSchema);

export default Kiosk;
