import mongoose, { Schema, models } from "mongoose";

const OperationsIncidentSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  incidentNumber: { type: String, required: true },
  type: {
    type: String,
    enum: ["KIOSK_FAILURE", "PRINT_FAILURE", "PAYMENT_FAILURE", "NETWORK_FAILURE", "SECURITY_EVENT", "SUPPORT_SLA", "STOCK_ALERT", "OTHER"],
    required: true,
  },
  severity: { type: String, enum: ["P1", "P2", "P3", "P4"], required: true },
  status: { type: String, enum: ["LOGGED", "CLASSIFIED", "ASSIGNED", "INVESTIGATING", "CONTAINED", "RESOLVED", "VERIFIED", "CLOSED"], default: "LOGGED", index: true },
  detectedAt: { type: Date, default: Date.now },
  detectedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  affectedSystem: { type: String, default: "KIOSK", maxlength: 100 },
  kioskId: { type: String, required: true, maxlength: 80 },
  description: { type: String, required: true, maxlength: 3000 },
  containment: { type: String, default: "", maxlength: 3000 },
  resolution: { type: String, default: "", maxlength: 3000 },
  owner: { type: Schema.Types.ObjectId, ref: "User", default: null },
  closedAt: { type: Date, default: null },
  auditReference: { type: String, default: "" },
}, { timestamps: true });

OperationsIncidentSchema.index({ tenantId: 1, incidentNumber: 1 }, { unique: true });
OperationsIncidentSchema.index({ tenantId: 1, status: 1, detectedAt: -1 });

const OperationsIncident = models.OperationsIncident || mongoose.model("OperationsIncident", OperationsIncidentSchema);

export default OperationsIncident;
