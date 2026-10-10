import mongoose, { Schema, models } from "mongoose";

const AuditEventSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true, maxlength: 100 },
  entityType: { type: String, required: true, maxlength: 80 },
  entityId: { type: String, required: true, maxlength: 120 },
  metadata: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: { createdAt: true, updatedAt: false } });

AuditEventSchema.index({ tenantId: 1, createdAt: -1 });

const AuditEvent = models.AuditEvent || mongoose.model("AuditEvent", AuditEventSchema);

export default AuditEvent;
